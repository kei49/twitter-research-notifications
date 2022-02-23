import { Agent } from 'http';
import { IncomingWebhook } from "@slack/webhook";
import { MessageAttachment, Block, KnownBlock } from '@slack/types';

const url = process.env.SLACK_WEBHOOK_URL || "";

export async function sendMessage(message: string | IncomingWebhookSendArguments) {
  const webhook = new IncomingWebhook(url);
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

export interface IncomingWebhookSendArguments extends IncomingWebhookDefaultArguments {
  attachments?: MessageAttachment[];
  blocks?: (KnownBlock | Block)[];
  unfurl_links?: boolean;
  unfurl_media?: boolean;
}

export interface IncomingWebhookResult {
  text: string;
}