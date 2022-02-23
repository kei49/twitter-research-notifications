// import cron from "node-cron";
// import startCron from "./cron";
import * as searchService from "./services/search.service";
import * as countService from "./services/count.service";

(async function () {
  await searchService.searchHackathon();
  // await countService.countHackathon();
})();
