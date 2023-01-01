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
import countInterestRateTask from "./countInterestRateTask";


export default async function startCron() {
  const disable = true;

  /**
   * Search with keywords
   */

  cron.schedule("0 9,13,19 * * *", async () => {
    await searchHackathonTask();
  });

  cron.schedule("0 8,9,12,15,18,21 * * *", async () => {
    await subscribeBloombergJPTask();
    await subscribeBloombergTask();
    await searchFinanceKeywordsTask();
  });

  !disable && cron.schedule("0 * * * *", async () => {
    await searchRussiaTask();
  });

  !disable && cron.schedule("* * * * *", async () => {
    await subscribeStepnActivationCodesTask();
  });

  /**
   * Subscribe from specific accounts
   */

  cron.schedule("*/10 * * * *", async () => {
    // every 10 minutes
    await pingFolloweeTweetsTask();
  });

  cron.schedule("5 * * * *", async () => {
    // at 5 minutes every hour
    // await subscribeFinanceTask();
    await subscribeBloombergCryptoTask();
  });

  !disable && cron.schedule("* * * * *", async () => {
    // every minutes
    await pingStepnFolloweeTweetsTask();
  }); 
  
  /**
   * Counter summary
   */
  
  cron.schedule("0 7,15,23 * * *", async () => {
    await countInterestRateTask();
  });
}
