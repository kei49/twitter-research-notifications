import TwitterClient from "../common/lib/twitter";
import { slackWebhookUrls, TaskId } from "../config";
import { TwitterCountSearchInput } from "../common/types";

export default class TwitterCountSearchToSlackUsecase {
  private twitterClient: TwitterClient;
  private webhookUrl?: string;

  constructor(slackWebhookUrl?: string) {
    this.twitterClient = new TwitterClient();
    this.webhookUrl = slackWebhookUrl;
  }

  async searchByQuery({
    granularity = 'week',
    ...queryInput
  }: TwitterCountSearchInput) {
    const query = this.twitterClient.buildQuery(queryInput);
    const params = this.twitterClient.buildCountSearchParams(
      query,
      granularity,
    );
    const results = await this.twitterClient.countRecent(params);
  }

  // async sendResultsToSlack({ username, text, data }: SlackMessageInput) {
  //   const message = getSlackMessageWithBlocks({ username, text, data });
  //   await slackServices.sendMessage(this.webhookUrl, undefined, message);
  // }
}
