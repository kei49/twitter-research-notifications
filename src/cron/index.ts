import cron from "node-cron";

import searchHackathonTask from "./searchHackathonTask";
import searchRussiaTask from "./searchRussiaTask";
// import countHackathonTask from "./countHackathonTask";

export default async function startCron() {
  cron.schedule("0 9,13,19 * * *", async () => {
    await searchHackathonTask();
  });

  cron.schedule("20 * * * *", async () => {
    await searchRussiaTask();
  })
}
