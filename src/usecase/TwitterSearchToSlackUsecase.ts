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
  private slackProvider: SlackProvider;

  constructor(taskId: TaskId, channel: string) {
    this.twitterClient = new TwitterClient();
    this.taskLocalStorage = new TaskLocalStorage(taskId);
    this.sinceId = this.taskLocalStorage.get("lastId") || undefined;
    this.slackProvider = new SlackProvider(channel);
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
    const data = await this.twitterClient.searchRecent(params, likeCountFilter);

    if (!data || data.length === 0) return;

    console.log("Number of data: ", data?.length);
    this.taskLocalStorage.set("lastId", data[0].id);

    return data;
  }

  async postResultsToSlack({
    data,
    firstMessage,
    chunkSize = 5,
  }: PostSlackInput) {
    const res = await this.slackProvider.postMessage(firstMessage);
    const thread_ts = res["ts"];

    const chunkedMessages = getChunkedTwitterMessages(data, chunkSize);

    chunkedMessages.forEach(async (messages) => {
      const text = messages.join("\n");

      await this.slackProvider.postMessage(text, thread_ts);
    });
  }
}
