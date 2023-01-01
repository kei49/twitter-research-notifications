import TwitterClient from "../common/lib/twitter";
import { getSlackMessageWithBlocks } from "../common/utils";
import { slackWebhookUrls } from "../config";
import * as slackServices from "../common/services/slack.service";

export default async function countInterestRateTask() {
  const twitterClient = new TwitterClient();
  const interestCounts = {
    query: "interest rate",
    granularity: "hour"
  }

  const results = await twitterClient.countsRecent(interestCounts);
  const slackBlocks = results.map((r) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: r,
    },
  }));

  const webhookUrl = slackWebhookUrls.financeCounter;

  await slackServices.sendMessage(webhookUrl, slackBlocks);
}
