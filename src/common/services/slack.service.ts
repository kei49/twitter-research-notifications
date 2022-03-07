import { Agent } from "http";
import { IncomingWebhook } from "@slack/webhook";
import { MessageAttachment, Block, KnownBlock } from "@slack/types";

export async function sendMessage(url: string, slackBlocks: SlackBlocks) {
  const webhook = new IncomingWebhook(url);

  const message = {
    username: "Twitter Research Notifications",
    text: "<@kei> Latest Search!",
    icon_emoji: ":ghost:",
    blocks: slackBlocks.slice(0, 49), // 50件までしかnotifyできない
  };

  await webhook.send(message);
}

export interface IncomingWebhookDefaultArguments {
  username?: string;
  icon_emoji?: string;
  icon_url?: string;
  channel?: string;
  text?: string;
  link_names?: boolean;
  agent?: Agent;
  timeout?: number;
}

export type SlackBlocks = (KnownBlock | Block)[];

export interface IncomingWebhookSendArguments
  extends IncomingWebhookDefaultArguments {
  attachments?: MessageAttachment[];
  blocks?: SlackBlocks;
  unfurl_links?: boolean;
  unfurl_media?: boolean;
}

export interface IncomingWebhookResult {
  text: string;
}
