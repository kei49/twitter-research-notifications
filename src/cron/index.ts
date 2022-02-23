import cron from "node-cron";

import searchHackathonTask from "./searchHackathonTask";
// import countHackathonTask from "./countHackathonTask";

export default async function startCron() {
  cron.schedule("0 9,13,19 * * *", async () => {
    await searchHackathonTask();
  });
}
