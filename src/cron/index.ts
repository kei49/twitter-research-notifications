import cron from "node-cron";
import pingFolloweeTweetsTask from "./pingFolloweeTweetsTask";
import pingStepnFolloweeTweetsTask from "./pingStepnFolloweeTweetsTask";
import searchFinanceKeywordsTask from "./searchFinanceKeywordsTask";

import searchHackathonTask from "./searchHackathonTask";
import searchRussiaTask from "./searchRussiaTask";
import subscribeBloombergCryptoTask from "./subscribeBloombergCryptoTask";
import subscribeBloombergTask from "./subscribeBloombergTask";
import subscribeFinanceTask from "./subscribeFinanceTask";
import subscribeBloombergJPTask from "./subscribeBloombergJPTask";
import subscribeStepnActivationCodesTask from "./subscribeStepnActivationCodesTask";
// import countHackathonTask from "./countHackathonTask";

export default async function startCron() {
  const disable = true;

  /**
   * Search with keywords
   */

  cron.schedule("0 9,13,19 * * *", async () => {
    await searchHackathonTask();
  });

  !disable && cron.schedule("0 * * * *", async () => {
    await searchRussiaTask();
  });

  cron.schedule("*/30 * * * *", async () => {
    await searchFinanceKeywordsTask();
    await subscribeBloombergTask();
    await subscribeBloombergJPTask();
  });

  !disable && cron.schedule("* * * * *", async () => {
    await subscribeStepnActivationCodesTask();
  });

  /**
   * Subscribe from specific accounts
   */

  !disable && cron.schedule("*/20 * * * * *", async () => {
    console.log("This is a test cron calling every 20 seconds");
  });

  !disable && cron.schedule("* * * * *", async () => {
    // every minutes
    await pingStepnFolloweeTweetsTask();
  });

  cron.schedule("5 * * * *", async () => {
    // at 5 minutes every hour
    await subscribeFinanceTask();
    await subscribeBloombergCryptoTask();
  });

  cron.schedule("30 5 * * * *", async () => {
    // at 5 minutes every hour
    await subscribeBloombergJPTask();
  });
 
  cron.schedule("*/10 * * * *", async () => {
    // every 10 minutes
    await pingFolloweeTweetsTask();
  });
}
