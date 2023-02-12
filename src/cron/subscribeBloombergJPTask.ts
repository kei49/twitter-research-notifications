import TwitterClient from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { slackWebhookUrls, taskIds } from "../config";
import { getSlackMessageWithBlocks } from "../common/utils";

/**
 * Fetch latest tweets from BloombergJapan https://twitter.com/BloombergJapan
 * Notify them to Slack
 */
export default async function subscribeBloombergJPTask() {
  const twitterClient = new TwitterClient();
  const taskLocalStorage = new TaskLocalStorage(taskIds.subscribeBloomberg);

  const sinceId = taskLocalStorage.get("lastId") || undefined;

  const keywords = "";
  const from = "from:BloombergJapan";

  console.log("here", keywords, from);

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

  const webhookUrl = slackWebhookUrls.finance;
  const message = getSlackMessageWithBlocks("ブルームバーグニュース!", "You got finance messages from BloombergJapan", data);

  await slackServices.sendMessage(webhookUrl, undefined, message);
}
