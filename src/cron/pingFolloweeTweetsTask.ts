import TwitterClient from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { followeeQuery, slackWebhookUrls, taskIds } from "../config";

/**
 * Ping all the tweets from specified followee to Slack almost in realtime
 */
export default async function pingFolloweeTweetsTask() {
  const twitterClient = new TwitterClient();
  const taskLocalStorage = new TaskLocalStorage(taskIds.pingFollowee);
  const sinceId = taskLocalStorage.get("lastId") || undefined;

  const keywords = ""
  const from = followeeQuery;

  const data = await twitterClient.searchRecent(keywords, sinceId, 100, -1, from, false, false, true, true);
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

  const webhookUrl = slackWebhookUrls.followee;

  await slackServices.sendMessage(webhookUrl, slackBlocks);
}
