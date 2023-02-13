import {
  generateFolloweeQuery,
  followeeList,
  taskIds,
  slackChannels,
} from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

/**
 * Ping the tweets from specified followee to Slack almost in realtime
 */
export async function pingFolloweeTweetsTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.pingFollowee,
    slackChannels.followee
  );

  const data = await interactor.searchByQuery({
    keywords: "",
    theFrom: generateFolloweeQuery(followeeList),
    notReply: true,
    notRetweet: true,
    maxResults: 100,
  });

  console.log("Data you got: ", data);

  if (!data) return;

  console.log("Number of data: ", data?.length);

  await interactor.postResultsToSlack({
    data,
    firstMessage: `You got tweets by your Twitter followee likes):`,
  });
}
