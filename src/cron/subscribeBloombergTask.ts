import TwitterClient from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { slackWebhookUrls, taskIds } from "../config";
import LineClient from "../common/lib/line";
import { getSlackMessageWithBlocks } from "../common/utils";

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

  const webhookUrl = slackWebhookUrls.finance;
  const message = getSlackMessageWithBlocks("Bloomberg!", "You got finance messages from Bloomberg", data);

  await slackServices.sendMessage(webhookUrl, undefined, message);
}
