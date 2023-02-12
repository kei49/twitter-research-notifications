import { WebClient } from "@slack/web-api";
import { baseConfig } from "../../config";

export class SlackProvider {
  web: WebClient;
  channel: string;

  constructor(channel: string) {
    this.web = new WebClient(baseConfig.slackToken);
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
