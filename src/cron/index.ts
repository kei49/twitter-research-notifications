import cron from "node-cron";
import pingFolloweeTweetsTask from "./pingFolloweeTweetsTask";

import searchHackathonTask from "./searchHackathonTask";
import searchRussiaTask from "./searchRussiaTask";
// import countHackathonTask from "./countHackathonTask";

export default async function startCron() {
  cron.schedule("0 9,13,19 * * *", async () => {
    await searchHackathonTask();
  });

  cron.schedule("0 * * * *", async () => {
    await searchRussiaTask();
  });

  cron.schedule("*/10 * * * * *", async () => { // every 3 minutes
    await pingFolloweeTweetsTask();
  })
}
