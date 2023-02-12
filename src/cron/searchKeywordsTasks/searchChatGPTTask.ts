import { chatGPTKeywords } from "../../common/constants";
import { slackWebhookUrls, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

export async function searchChatGPTTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.searchChatGPT,
    "twitter-chatgpt"
  );

  const likeCountFilter = -1;

  const data = await interactor.searchByQuery({
    keywords: chatGPTKeywords,
    theFrom: undefined,
    notReply: true,
    notRetweet: true,
    maxResults: 100,
    likeCountFilter,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    data,
    firstMessage: `${data.length} trending tweets (more than ${likeCountFilter} likes) about ChatGPT: `,
  });
}
