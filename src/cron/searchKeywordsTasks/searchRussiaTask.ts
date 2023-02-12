import { slackWebhookUrls, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

/**
 * Fetch latest tweets about ロシア from Reuters https://twitter.com/ReutersJapan
 * Notify them to Slack
 */
export async function searchRussiaTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.searchRussia,
    slackWebhookUrls.reutersRussia
  );

  const data = await interactor.searchByKeywords({
    keywords: "ロシア",
    theFrom: "from:ReutersJapan",
    notReply: true,
    notRetweet: true,
    maxResults: 30,
  });

  if (!data) return;

  await interactor.sendResultsToSlack({
    username: "ReutersJapan!",
    text: `About Russia: `,
    data,
  });
}
