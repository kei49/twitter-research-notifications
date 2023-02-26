import dayjs from "dayjs";
import { voicePingKeywords } from "../../common/constants";
import { taskIds } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

export async function searchVoicePingTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.searchVoicePing,
  );

  const data = await interactor.searchByQuery({
    keywords: voicePingKeywords,
    theFrom: undefined,
    notRetweet: true,
    maxResults: 100,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    channel: "twitter-voice-ping", // slackChannels.voicePing,
    data,
    firstMessage: `Found ${data.length} new tweets related to VoicePing business: `,
  });
}