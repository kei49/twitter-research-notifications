import { WebClient } from "@slack/web-api";
import { baseConfig } from "../../config";

export class SlackProvider {
  web: WebClient;
  channel: string;

  constructor(channel: string, slackToken?: string) {
    const token = slackToken ? slackToken : baseConfig.slackToken;

    this.web = new WebClient(token);
    this.channel = `#${channel}`;
  }

  async postMessage(text: string, thread_ts?: string) {
    const result = await this.web.chat.postMessage({
      text,
      channel: this.channel,
      thread_ts,
    });

    return result;
  }
}
