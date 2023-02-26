import TwitterClient, { TweetsSearchData } from "../common/lib/twitter";
import TaskLocalStorage from "../common/localStorage";
import { baseConfig, TaskId } from "../config";
import { getChunkedTwitterMessages } from "../common/utils";
import { PostSlackInput, TwitterSearchInput } from "../common/types";
import { SlackProvider } from "../common/provider/slack.provider";
import _ from "lodash";

export default class TwitterSearchToSlackUsecase {
  private twitterClient: TwitterClient;
  private taskLocalStorage: TaskLocalStorage;
  private sinceId: string | undefined;
  private nextToken: string | undefined;
  private usePaging?: boolean;

  constructor(taskId: TaskId, usePaging?: boolean) {
    this.twitterClient = new TwitterClient();
    this.taskLocalStorage = new TaskLocalStorage(taskId);
    this.sinceId = this.taskLocalStorage.get("lastId") || undefined;

    this.usePaging = usePaging || undefined;

    if (usePaging){
      this.nextToken = this.taskLocalStorage.get("nextToken") || undefined;
    }
  }

  async searchByQuery({
    maxResults = 30,
    likeCountFilter = -1,
    retweetCountFilter = -1,
    start_time,
    ...queryInput
  }: TwitterSearchInput) {
    const query = this.twitterClient.buildQuery(queryInput);

    const params = this.twitterClient.buildSearchParams(
      query,
      maxResults,
      start_time,
      this.sinceId
    );
    const results = await this.twitterClient.searchRecent(
      params,
      likeCountFilter,
      retweetCountFilter,
      this.nextToken
    );

    if (!results || !results.data || results.data.length === 0) return;

    
    if (this.usePaging && results.nextToken) {
      this.taskLocalStorage.set("nextToken", results.nextToken);
      this.taskLocalStorage.remove("lastId");
    } else {
      this.taskLocalStorage.remove("nextToken");
      this.taskLocalStorage.set("lastId", results.data[0].id);
    }

    return results.data;
  }

  async postResultsToSlack({
    token,
    channel,
    data,
    firstMessage,
    chunkSize = 5,
  }: PostSlackInput) {
    console.log(`@@@ notifying data to ${channel}`);
    const slackToken = token ? token : baseConfig.slackToken.base;
    const slackProvider = new SlackProvider(channel, slackToken);

    const res = await slackProvider.postMessage(firstMessage);
    const thread_ts = res["ts"];

    console.log("==== using thread_ts: ", thread_ts);

    const chunkedMessages = getChunkedTwitterMessages(data, chunkSize);

    chunkedMessages.forEach(async (messages) => {
      const text = messages.join("\n");

      await slackProvider.postMessage(text, thread_ts);
    });
  }
}
