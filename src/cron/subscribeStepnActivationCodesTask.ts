import TwitterClient from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { slackWebhookUrls, taskIds } from "../config";
import LineClient from "../common/lib/line";

/**
 * Fetch latest tweets about ロシア from Reuters https://twitter.com/ReutersJapan
 * Notify them to Slack
 */
export default async function subscribeStepnActivationCodesTask() {
  const twitterClient = new TwitterClient();
  const lineClient = new LineClient();
  const taskLocalStorage = new TaskLocalStorage(taskIds.stepnActivationCodes);
  const sinceId = taskLocalStorage.get("lastId") || undefined;

  const keywords = "STEPN activation code -follow -Follow -FOLLOW";

  const data = await twitterClient.searchRecent(
    keywords,
    sinceId,
    30,
    -1
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

  const webhookUrl = slackWebhookUrls.base;

  await slackServices.sendMessage(webhookUrl, slackBlocks);

  await lineClient.pushMessage(links);
}
