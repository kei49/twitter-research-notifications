import { slackChannels, slackWebhookUrls, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

/**
 * Fetch latest tweets about ロシア from Reuters https://twitter.com/ReutersJapan
 * Notify them to Slack
 */
export async function searchRussiaTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.searchRussia,
    slackChannels.russia
  );

  const data = await interactor.searchByQuery({
    keywords: "ロシア",
    theFrom: "from:ReutersJapan",
    notReply: true,
    notRetweet: true,
    maxResults: 30,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    data,
    firstMessage: `About Russia: `,
  });
}
