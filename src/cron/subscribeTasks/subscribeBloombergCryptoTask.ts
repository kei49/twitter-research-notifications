import { slackWebhookUrls, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

export async function subscribeBloombergCryptoTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.subscribebloombergCrypto,
    slackWebhookUrls.crypto
  );
  const data = await interactor.searchByQuery({
    keywords: "",
    theFrom: "from:crypto",
    notReply: true,
    notRetweet: true,
    maxResults: 30,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    data,
    firstMessage: `<@kei> You got messages from bloomberg crypto!!`,
  });
}
