import moment from "moment-timezone";

import { TweetsSearchData } from "../../common/lib/twitter";
import * as slackServices from "../../common/services/slack.service";
import { SlackMessageInput } from "../types";

/**
 * isAnd is used for connection between base and li, not used for connection between li elements
 */
export function addListQueryWithOr(base: string, li: string[], isAnd: boolean) {
  let i = 0;
  let query = base;
  while (i < li.length) {
    if (i === 0 && isAnd) {
      query = query + " (" + li[i++];
    }

    query = query + " OR " + li[i++];

    if (i === li.length && isAnd) {
      query = query + ")";
    }
  }
  return query;
}

export function getSlackMessageWithBlocks({
  username,
  text,
  icon_emoji = ":ghost:",
  data,
}: SlackMessageInput) {
  const message: slackServices.Message = {
    username,
    text,
    icon_emoji,
    blocks: getTwitterMessagesForSlack(data).slice(0, 49), // 50件までしかnotifyできない
  };
  return message;
}

export function getTwitterMessagesForSlack(data: TweetsSearchData[]) {
  const getTwitterLink = (id: string, author_id: string) =>
    `https://twitter.com/${author_id}/status/${id}`;
  const removeHttps = (text: string) => text.split("https")[0];

  const slackBlocks = data.map((d) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<${getTwitterLink(d.id, d.author_id)}|${d.text}>`,
    },
  }));

  return slackBlocks;
}

export const convertTimeInJST = (d: string) => {
  return moment(d).tz("Asia/Tokyo").format("YYYYMMDD-hhmm").toString();
};
