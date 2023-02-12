import { TweetsSearchData } from "./lib/twitter";

export interface SlackMessageInput {
  username: string;
  text: string;
  icon_emoji?: string;
  data: TweetsSearchData[];
}

export interface BuildQuqeryData {
  keywords: string;
  theFrom?: string;
  hasHashtags?: boolean;
  hasLinks?: boolean;
  notReply?: boolean;
  notRetweet?: boolean;
}

export interface TwitterSearchInput extends BuildQuqeryData {
  maxResults?: number;
  likeCountFilter?: number;
}
