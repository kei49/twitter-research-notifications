import TwitterClient from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { slackWebhookUrls, taskIds } from "../config";

/**
 * Fetch latest tweets from Finance accounts such as IGcom
 * Notify them to Slack
 */
export default async function subscribeFinanceTask() {
  const twitterClient = new TwitterClient();
  const taskLocalStorage = new TaskLocalStorage(taskIds.subscribeFinance);

  const sinceId = taskLocalStorage.get("lastId") || undefined;

  const keywords = "";
  const from = "from:IGcom";

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

  const message: slackServices.Message = {
    username: "Latest Finance News!",
    text: "<@kei> You got finance messages",
    icon_emoji: ":ghost:",
    blocks: slackBlocks.slice(0, 49), // 50件までしかnotifyできない
  };

  await slackServices.sendMessage(webhookUrl, undefined, message);
}
