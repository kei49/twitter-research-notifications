import TwitterClient, { TweetsSearchData } from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { slackWebhookUrls, TaskId, taskIds } from "../config";
import { getSlackMessageWithBlocks } from "../common/utils";
import { SlackMessageInput, TwitterSearchInput } from "../common/types";

export default class TwitterSearchToSlackUsecase {
  private twitterClient: TwitterClient;
  private taskLocalStorage: TaskLocalStorage;
  private sinceId: string | undefined;
  private webhookUrl: string;

  constructor(taskId: TaskId, slackWebhookUrl: string) {
    this.twitterClient = new TwitterClient();
    this.taskLocalStorage = new TaskLocalStorage(taskId);
    this.sinceId = this.taskLocalStorage.get("lastId") || undefined;
    this.webhookUrl = slackWebhookUrl;
  }

  async searchByKeywords({
    maxResults = 30,
    likeCountFilter = -1,
    ...queryInput
  }: TwitterSearchInput) {
    const query = this.twitterClient.buildQuery(queryInput);
    const params = this.twitterClient.buildSearchParams(
      query,
      maxResults,
      this.sinceId
    );
    const data = await this.twitterClient.searchRecent(params, likeCountFilter);

    if (!data || data.length === 0) return;

    console.log("Number of data: ", data?.length);
    this.taskLocalStorage.set("lastId", data[0].id);

    return data;
  }

  async sendResultsToSlack({ username, text, data }: SlackMessageInput) {
    const message = getSlackMessageWithBlocks({ username, text, data });
    await slackServices.sendMessage(this.webhookUrl, undefined, message);
  }
}
