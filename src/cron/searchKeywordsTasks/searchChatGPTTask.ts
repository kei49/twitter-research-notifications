import dayjs from "dayjs";
import { chatGPTKeywords } from "../../common/constants";
import { slackWebhookUrls, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

export async function searchChatGPTTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.searchChatGPT,
    "twitter-chatgpt"
  );

  const likeCountFilter = 50;

  const data = await interactor.searchByQuery({
    keywords: chatGPTKeywords,
    theFrom: undefined,
    hasLinks: true,
    notReply: true,
    notRetweet: true,
    lang: "en",
    maxResults: 100,
    start_time: dayjs().subtract(1, "day").toDate(),
    likeCountFilter,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    data,
    firstMessage: `${data.length} trending tweets (more than ${likeCountFilter} likes) about ChatGPT: `,
  });
}
