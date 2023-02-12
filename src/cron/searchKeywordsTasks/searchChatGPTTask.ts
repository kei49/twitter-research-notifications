import { slackWebhookUrls, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

export async function searchChatGPTTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.searchChatGPT,
    slackWebhookUrls.finance
  );

  const likeCountFilter = 30;

  const data = await interactor.searchByKeywords({
    keywords: "ChatGPT amazing",
    theFrom: undefined,
    notReply: true,
    notRetweet: true,
    maxResults: 100,
    likeCountFilter,
  });

  if (!data) return;

  await interactor.sendResultsToSlack({
    username: "ChatGPT Screener!",
    text: `Trending tweets (more than ${likeCountFilter} likes) about ChatGPT: `,
    data,
  });
}
