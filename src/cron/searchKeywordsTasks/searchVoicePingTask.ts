import dayjs from "dayjs";
import { voicePingBlackListKeywords, voicePingBlackListUsers, voicePingKeywords } from "../../common/constants";
import { slackChannels, taskIds, baseConfig } from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";
import { twitterBlackListQueryBuilder } from "../../common/utils/twitter";

export async function searchVoicePingTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.searchVoicePing,
  );

  const theFrom = twitterBlackListQueryBuilder("user", voicePingBlackListUsers);
  const blackKeywords = twitterBlackListQueryBuilder("keyword", voicePingBlackListKeywords);

  const data = await interactor.searchByQuery({
    keywords: `${voicePingKeywords} ${blackKeywords}`,
    theFrom,
    notRetweet: true,
    maxResults: 100,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    channel: slackChannels.voicePing,
    token: baseConfig.slackToken.base,
    data,
    firstMessage: `Found ${data.length} new tweets related to VoicePing business: `,
  });
}