import TwitterClient from "../common/lib/twitter";
import * as slackServices from "../common/services/slack.service";
import TaskLocalStorage from "../common/localStorage";
import { generateFolloweeQuery, slackWebhookUrls, stepnFolloweeList, taskIds } from "../config";

/**
 * Ping all the tweets from specified STEPN followee to Slack almost in realtime
 */
export default async function pingStepnFolloweeTweetsTask() {
  const twitterClient = new TwitterClient();
  const taskLocalStorage = new TaskLocalStorage(taskIds.pingStepnFollowee);
  const sinceId = taskLocalStorage.get("lastId");

  const keywords = "";
  const from = generateFolloweeQuery(stepnFolloweeList);;

  const data = await twitterClient.searchRecent(
    keywords,
    sinceId,
    30,
    -1,
    from,
    false,
    false,
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

  const webhookUrl = slackWebhookUrls.stepnFollowee;

  const message: slackServices.Message = {
    username: "STEPN Latest Info!",
    text: "<@kei> You got important messages!!",
    icon_emoji: ":ghost:",
    blocks: slackBlocks.slice(0, 49), // 50件までしかnotifyできない
  };

  await slackServices.sendMessage(webhookUrl, undefined, message);
}
