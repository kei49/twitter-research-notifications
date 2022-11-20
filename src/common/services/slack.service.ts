import { Agent } from "http";
import { IncomingWebhook } from "@slack/webhook";
import { MessageAttachment, Block, KnownBlock } from "@slack/types";

export async function sendMessage(url: string, slackBlocks?: SlackBlocks, customMessage?: Message) {
  const webhook = new IncomingWebhook(url);

  const message: Message | undefined = slackBlocks ? {
    username: "Twitter Research Notifications",
    text: "<@kei> Latest Search!",
    icon_emoji: ":ghost:",
    blocks: slackBlocks.slice(0, 49), // 50件までしかnotifyできない
  } : customMessage
    ? customMessage
    : undefined

  if (!message) throw new Error("Error: Invalid Slack message");

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

export interface Message {
  username: string;
  text: string;
  icon_emoji: string;
  blocks: SlackBlocks;
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
