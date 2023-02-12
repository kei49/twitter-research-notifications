import TwitterClient from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { slackWebhookUrls, taskIds } from "../config";
import LineClient from "../common/lib/line";

/**
 * Fetch latest tweets from Bloomberg https://twitter.com/business
 * Notify them to Slack
 */
export default async function subscribeBloombergCryptoTask() {
  const twitterClient = new TwitterClient();
  const lineClient = new LineClient();
  const taskLocalStorage = new TaskLocalStorage(taskIds.subscribebloombergCrypto);

  const sinceId = taskLocalStorage.get("lastId") || undefined;

  const keywords = "";
  const from = "from:crypto";

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
  if (!data || data.length === 0) return;

  console.log("Number of data: ", data.length);

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

  const webhookUrl = slackWebhookUrls.crypto;

  const message: slackServices.Message = {
    username: "Crypto Latest Info!",
    text: "<@kei> You got messages from bloomberg crypto!!",
    icon_emoji: ":ghost:",
    blocks: slackBlocks.slice(0, 49), // 50件までしかnotifyできない
  };

  await slackServices.sendMessage(webhookUrl, slackBlocks);
}
