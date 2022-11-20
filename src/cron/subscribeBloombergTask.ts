import TwitterClient from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { slackWebhookUrls, taskIds } from "../config";
import LineClient from "../common/lib/line";

/**
 * Fetch latest tweets from Bloomberg https://twitter.com/business
 * Notify them to Slack
 */
export default async function subscribeBloombergTask() {
  const twitterClient = new TwitterClient();
  const lineClient = new LineClient();
  const taskLocalStorage = new TaskLocalStorage(taskIds.subscribeBloomberg);

  const sinceId = taskLocalStorage.get("lastId") || undefined;

  const keywords = "(Nasdaq OR Bitcoin OR China OR Japan OR BOJ)";
  const from = "from:business";

  const data = await twitterClient.searchRecent(
    keywords,
    sinceId,
    30,
    -1,
    from,
    false,
    undefined,
    true,
    true
  );
  console.log("Number of data: ", data.length);

  if (data.length === 0) return;

  const lastId = data[0].id;
  taskLocalStorage.set("lastId", lastId);

  const links = data.map(
    (d) => `https://twitter.com/${d.author_id}/status/${d.id}`
  );

  const slackBlocks = links.map((link) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<${link}|${link}>`,
    },
  }));

  const webhookUrl = slackWebhookUrls.finance;

  await slackServices.sendMessage(webhookUrl, slackBlocks);

  await lineClient.pushMessage(links);
}
