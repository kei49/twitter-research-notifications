import dayjs from "dayjs";
import { chatGPTKeywords } from "../../common/constants";
import { baseConfig, slackChannels, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

export async function searchChatGPTTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.searchChatGPT,
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
    token: baseConfig.slackToken.awesomeAi,
    channel: slackChannels.chatGPT,
    data,
    firstMessage: `${data.length} trending tweets (more than ${likeCountFilter} likes) about ChatGPT: `,
  });

  await interactor.postResultsToSlack({
    token: baseConfig.slackToken.aiMkt,
    channel: slackChannels.chatGPT,
    data,
    firstMessage: `${data.length} trending tweets (more than ${likeCountFilter} likes) about ChatGPT: `,
  });
}