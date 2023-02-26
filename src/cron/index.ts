import cron from "node-cron";

import {
  pingFolloweeTweetsTask,
  subscribeBloombergTask,
  subscribeBloombergJPTask,
  subscribeBloombergCryptoTask,
} from "./subscribeTasks";
import {
  searchChatGPTTask,
  searchHackathonTask,
  searchRussiaTask,
} from "./searchKeywordsTasks";
import {
  countChatGPTTask,
  countInterestRateTask,
  countHackathonTask,
} from "./countTasks";
import { searchVoicePingTask } from "./searchKeywordsTasks/searchVoicePingTask";

export default async function startCron() {
  const disable = true;

  /**
   * TESTING
   */

  cron.schedule("0 8 * * *", async () => {
    await countChatGPTTask();
  });

  /**
   * Subscribe from specific accounts
   */
  cron.schedule("*/10 * * * *", async () => {
    // every 10 minutes
    await pingFolloweeTweetsTask();
  });
  cron.schedule("0 8,9,12,15,18,21 * * *", async () => {
    // at 5 minutes every hour
    await subscribeBloombergTask();
    await subscribeBloombergJPTask();
    await subscribeBloombergCryptoTask();
  });

  /**
   * Search with keywords
   */
  cron.schedule("50 28 * * * *", async () => {
    await searchChatGPTTask();
  });
  cron.schedule("57 * * * *", async () => {
    await searchRussiaTask();
  });

  cron.schedule("*/30 * * * *", async () => {
    await searchVoicePingTask();
  })

  /**
   * Counter summary
   */

  cron.schedule("0 7,15,23 * * *", async () => {
    await countInterestRateTask();
  });
}
