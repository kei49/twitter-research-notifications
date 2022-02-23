import * as dotenv from "dotenv";

dotenv.config();

export const baseConfig = {
  token: process.env.BEARER_TOKEN,
};

export const twitterAPI = {
  basePath: "https://api.twitter.com/2/",
  searchRecentPath: "tweets/search/recent",
  countsRecent: "tweets/counts/recent",
};
