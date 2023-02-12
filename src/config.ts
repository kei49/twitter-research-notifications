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
  pingStepnFollowee: "pingStepnFollowee",
  stepnActivationCodes: "stepnActivationCodes",
  searchFinanceKeywords: "searchFinanceKeywords",
  subscribeBloomberg: "subscribeBloomberg",
  subscribeBloombergJP: "subscribeBloombergJP",
  subscribebloombergCrypto: "subscribebloombergCrypto",
  subscribeFinance: "subscribeFinance",
  searchChatGPT: "searchChatGPT"
} as const;

export const slackWebhookUrls = {
  base: process.env.SLACK_WEBHOOK_URL || "",
  reutersRussia: process.env.SLACK_WEBHOOK_REUTERS_RUSSIA_URL || "",
  followee: process.env.SLACK_WEBHOOK_FOLLOWEE_URL || "",
  stepnFollowee: process.env.SLACK_WEBHOOK_STEPN_FOLLOWEE_URL || "",
  finance: process.env.SLACK_WEBHOOK_FINANCE_URL || "",
  financeCounter: process.env.SLACK_WEBHOOK_COUNTER_FINANCE_URL || "",
  crypto: process.env.SLACK_WEBHOOK_CRYPTO_URL || "",
  chatGPT: process.env.SLACK_WEBHOOK_CHATGPT_URL || "",
};

const getListFromString = (str?: string) => str?.split(",") || [];

export const followeeList = getListFromString(process.env.PING_FOLLOWEE_LIST)

export const stepnFolloweeList = getListFromString(process.env.STEPN_PING_FOLLOWEE_LIST)


const generateQueryReduceHelper = (acc: string, cur: string, isLast: boolean) =>
  isLast ? acc + "from:" + cur + ") " : acc + "from:" + cur + " OR ";

export const generateFolloweeQuery = (fList: string[]) =>
  fList.length > 0
    ? fList.reduce(
        (acc, cur, i) => generateQueryReduceHelper(acc, cur, fList.length === i + 1),
        "("
      )
    : "";

export const taskIdsArray = Object.values(taskIds);
export type TaskId = typeof taskIdsArray[number];
