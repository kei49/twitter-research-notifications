import { slackWebhookUrls, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

/**
 * Fetch latest tweets from BloombergJapan https://twitter.com/BloombergJapan
 * Notify them to Slack
 */
export async function subscribeBloombergJPTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.subscribeBloombergJP,
    slackWebhookUrls.finance
  );
  const data = await interactor.searchByKeywords({
    keywords: "",
    theFrom: "from:BloombergJapan",
    notReply: true,
    notRetweet: true,
    maxResults: 30,
  });

  if (!data) return;

  await interactor.sendResultsToSlack({
    username: "ブルームバーグニュース!",
    text: `<@kei> You got finance messages from BloombergJapan!`,
    data,
  });
}
