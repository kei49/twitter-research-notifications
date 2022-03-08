import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { baseConfig, lineAPI } from "../../config";

export default class LineClient {
  private async post(path: string, messages: string[]) {
    const url = lineAPI.basePath + path;
    const retryKey = uuidv4();

    const body = {
      to: baseConfig.lineGroupId,
      messages,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${baseConfig.lineAccessToken}`,
      "X-Line-Retry-Key": retryKey,
    };

    console.log(url, headers, body);

    return await axios.post(url, body, { headers });
  }

  async pushMessage(messages: string[]) {
    let messageBlock = [];

    if (messages.length > 5) {
      for (let i = 0; i < Math.ceil(messages.length / 5); i++) {
        const newMessageBlock = messages.slice(i * 5, (i + 1) * 5);
        messageBlock.push(newMessageBlock);
      }
    } else {
      messageBlock.push(messages);
    }

    const result = await Promise.all(
      messageBlock.map(async (block) => {
        const res = await this.post(lineAPI.pushMessage, block);
        const data = res.data;
        return data;
      })
    );

    console.log(result);
  }
}
