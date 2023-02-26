import dayjs from "dayjs";
import { voicePingKeywords } from "../../common/constants";
import { baseConfig, slackChannels, taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

export async function searchVoicePingTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.searchVoicePing,
    slackChannels.voicePing,
    undefined,
    baseConfig.slackTokenVoicePing
  );

  const data = await interactor.searchByQuery({
    keywords: voicePingKeywords,
    theFrom: undefined,
    notRetweet: true,
    maxResults: 100,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    data,
    firstMessage: `Found ${data.length} new tweets related to VoicePing business: `,
  });
}