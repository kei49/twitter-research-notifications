import TwitterClient, { TweetsSearchData } from "../common/lib/twitter";
import TaskLocalStorage from "../common/localStorage";
import { TaskId } from "../config";
import { getChunkedTwitterMessages } from "../common/utils";
import { PostSlackInput, TwitterSearchInput } from "../common/types";
import { SlackProvider } from "../common/provider/slack.provider";
import _ from "lodash";

export default class TwitterSearchToSlackUsecase {
  private twitterClient: TwitterClient;
  private taskLocalStorage: TaskLocalStorage;
  private sinceId: string | undefined;
  private nextToken: string | undefined;
  private channel: string;

  constructor(taskId: TaskId, channel: string) {
    this.twitterClient = new TwitterClient();
    this.taskLocalStorage = new TaskLocalStorage(taskId);
    this.sinceId = this.taskLocalStorage.get("lastId") || undefined;
    this.nextToken = this.taskLocalStorage.get("nextToken") || undefined;
    this.channel = channel;
  }

  async searchByQuery({
    maxResults = 30,
    likeCountFilter = -1,
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
      this.nextToken
    );

    if (!results || !results.data || results.data.length === 0) return;

    this.taskLocalStorage.set("lastId", results.data[0].id);
    results.nextToken &&
      this.taskLocalStorage.set("nextToken", results.nextToken);

    return results.data;
  }

  async postResultsToSlack({
    data,
    firstMessage,
    chunkSize = 5,
  }: PostSlackInput) {
    console.log(`@@@ notifying data to ${this.channel}`);
    const slackProvider = new SlackProvider(this.channel);
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
