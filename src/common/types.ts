import { TweetsSearchData } from "./lib/twitter";

export interface SlackMessageInput {
  username: string;
  text: string;
  icon_emoji?: string;
  data: TweetsSearchData[];
}

export interface SlackPostInput {
  channel: string;
  text: string;
  data: TweetsSearchData[];
}

export interface BuildQuqeryData {
  keywords: string;
  theFrom?: string;
  hasHashtags?: boolean;
  hasLinks?: boolean;
  notReply?: boolean;
  notRetweet?: boolean;
  lang?: string;
}

export interface TwitterSearchInput extends BuildQuqeryData {
  maxResults?: number;
  start_time?: Date;
  likeCountFilter?: number;
}

export interface TwitterCountSearchInput extends BuildQuqeryData {
  granularity: string;
}

export interface PostSlackInput {
  data: TweetsSearchData[];
  firstMessage: string;
  chunkSize?: number;
}
