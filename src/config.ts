import * as dotenv from "dotenv";

dotenv.config();

export const baseConfig = {
  token: process.env.BEARER_TOKEN,
  lineAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  lineGroupId: process.env.LINE_GROUP_ID,
};

export const twitterAPI = {
  basePath: "https://api.twitter.com/2/",
  searchRecentPath: "tweets/search/recent",
  countsRecent: "tweets/counts/recent",
};

export const lineAPI = {
  basePath: "https://api.line.me/v2/bot/",
  pushMessage: "message/push",
};

export const taskIds = {
  searchRussia: "searchRussia",
  searchHackathon: "searchHackathon",
  pingFollowee: "pingFollowee",
} as const;

export const slackWebhookUrls = {
  base: process.env.SLACK_WEBHOOK_URL || "",
  followee: process.env.SLACK_WEBHOOK_FOLLOWEE_URL || "",
};

const followeeList = process.env.PING_FOLLOWEE_LIST?.split(",") || [];

const generateQuery = (acc: string, cur: string, isLast: boolean) =>
  isLast ? acc + "from:" + cur + ") " : acc + "from:" + cur + " OR ";

export const followeeQuery =
  followeeList.length > 0
    ? followeeList.reduce(
        (acc, cur, i) => generateQuery(acc, cur, followeeList.length === i + 1),
        "("
      )
    : "";

export const taskIdsArray = Object.values(taskIds);
export type TaskId = typeof taskIdsArray[number];
