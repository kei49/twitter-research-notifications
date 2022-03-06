import TwitterClient from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { taskIds } from "../config";

/**
 * Fetch latest tweets about ロシア from Reuters https://twitter.com/ReutersJapan
 * Notify them to Slack
 */
export default async function searchRussiaTask() {
  const twitterClient = new TwitterClient();
  const taskLocalStorage = new TaskLocalStorage(taskIds.searchRussia);
  const sinceId = taskLocalStorage.get("lastId") || undefined;

  const keywords = "ロシア"
  const from = "from:ReutersJapan"

  const data = await twitterClient.searchRecent(keywords, sinceId, 30, -1, from, false);
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

  await slackServices.sendMessage(slackBlocks);
}
