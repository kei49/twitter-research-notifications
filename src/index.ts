// import cron from "node-cron";
// import startCron from "./cron";
import * as searchController from "./controllers/search.controller";
import * as countController from "./controllers/count.controller";

(async function () {
  await searchController.searchHackathon();
  // await countController.countHackathon();
})();
