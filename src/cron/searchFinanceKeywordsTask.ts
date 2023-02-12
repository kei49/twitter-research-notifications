import TwitterClient from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { slackWebhookUrls, taskIds } from "../config";
import LineClient from "../common/lib/line";
import { getSlackMessageWithBlocks } from "../common/utils";

/**
 * Fetch latest tweets about finance
 * Notify them to Slack
 */
export default async function searchFinanceKeywordsTask() {
  const twitterClient = new TwitterClient();
  const lineClient = new LineClient();
  const taskLocalStorage = new TaskLocalStorage(taskIds.searchFinanceKeywords);

  const tryReset = true;
  tryReset && taskLocalStorage.set("lastId", "");

  const sinceId = taskLocalStorage.get("lastId") || undefined;

  const keywords = "(円安 OR 金利 OR BOJ)"; // "円安" "金利" "us bond yields" "BOJ"
  const from = "";

  const data = await twitterClient.searchRecent(
    keywords,
    sinceId,
    30,
    30,
    undefined,
    undefined,
    undefined,
    true,
    true
  );
  if (!data || data.length === 0) return;

  console.log("Number of data: ", data.length);

  const lastId = data[0].id;
  taskLocalStorage.set("lastId", lastId);

  const webhookUrl = slackWebhookUrls.finance;
  const message = getSlackMessageWithBlocks("円に関するキーワード", "You got finance messages about 円安 OR 金利 OR BOJ", data);

  await slackServices.sendMessage(webhookUrl, undefined, message);
}
