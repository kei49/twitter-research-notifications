import TwitterClient from "../../common/lib/twitter";
import * as slackServices from "../../common/services/slack.service";
import TaskLocalStorage from "../../common/localStorage";
import {
  generateFolloweeQuery,
  followeeList,
  slackWebhookUrls,
  taskIds,
} from "../../config";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

/**
 * Ping the tweets from specified followee to Slack almost in realtime
 */
export async function pingFolloweeTweetsTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.pingFollowee,
    slackWebhookUrls.followee
  );

  const likeCountFilter = 10;

  const data = await interactor.searchByQuery({
    keywords: "",
    theFrom: generateFolloweeQuery(followeeList),
    notReply: true,
    notRetweet: true,
    maxResults: 100,
    likeCountFilter,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    data,
    firstMessage: `You got tweets by your Twitter followee (more than ${likeCountFilter} likes):`,
  });
}
