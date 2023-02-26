import { slackChannels, slackWebhookUrls, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

/**
 * Fetch latest tweets from BloombergJapan https://twitter.com/BloombergJapan
 * Notify them to Slack
 */
export async function subscribeBloombergJPTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.subscribeBloombergJP,
  );
  const data = await interactor.searchByQuery({
    keywords: "",
    theFrom: "from:BloombergJapan",
    notReply: true,
    notRetweet: true,
    maxResults: 30,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    channel: slackChannels.finance,
    data,
    firstMessage: `<@kei> You got finance messages from BloombergJapan!`,
  });
}
