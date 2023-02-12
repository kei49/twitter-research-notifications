import TwitterClient from "../../common/lib/twitter";
import * as slackServices from "../../common/services/slack.service";
import TaskLocalStorage from "../../common/localStorage";
import { slackWebhookUrls, taskIds } from "../../config";
import { getSlackMessageWithBlocks } from "../../common/utils";

/**
 * Fetch latest tweets about ロシア from Reuters https://twitter.com/ReutersJapan
 * Notify them to Slack
 */
export default async function searchChatGPTTask() {
  const twitterClient = new TwitterClient();
  const taskLocalStorage = new TaskLocalStorage(taskIds.searchChatGPT);
  const sinceId = undefined; // taskLocalStorage.get("lastId") || undefined;

  const keywords = "ChatGPT amazing";
  const likeCount = 30;

  const data = await twitterClient.searchRecent(
    keywords,
    sinceId,
    100,
    likeCount,
    undefined,
    false,
    true,
    true,
  );

  if (!data || data.length === 0) return;

  console.log("Number of data: ", data.length);

  const lastId = data[0].id;
  taskLocalStorage.set("lastId", lastId);

  const webhookUrl = slackWebhookUrls.finance;
  const message = getSlackMessageWithBlocks("ChatGPT Screener!", `Trending tweets (more than ${likeCount} likes) about ChatGPT: `, data);

  await slackServices.sendMessage(webhookUrl, undefined, message);
}
