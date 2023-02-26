import dayjs from "dayjs";
import { chatGPTKeywords } from "../../common/constants";
import { slackChannels, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

export async function searchChatGPTTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.searchChatGPT,
    slackChannels.chatGPT
  );

  const likeCountFilter = 90;
  const retweetCountFilter = 30;

  const data = await interactor.searchByQuery({
    keywords: chatGPTKeywords,
    theFrom: undefined,
    hasLinks: true,
    notReply: true,
    notRetweet: true,
    lang: "en",
    maxResults: 100,
    // start_time: dayjs().subtract(1, "day").toDate(),
    likeCountFilter,
    retweetCountFilter,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    data,
    firstMessage: `<@kei> ${data.length} trending tweets (more than ${likeCountFilter} likes) about ChatGPT: `,
  });
}