import TwitterClient from "../../common/lib/twitter";
import * as slackServices from "../../common/services/slack.service";
import TaskLocalStorage from "../../common/localStorage";
import { slackChannels, slackWebhookUrls, taskIds } from "../../config";
import LineClient from "../../common/lib/line";
import { getSlackMessageWithBlocks } from "../../common/utils";
import TwitterSearchToSlackUsecase from "../../usecase/TwitterSearchToSlackUsecase";

/**
 * Fetch latest tweets from Bloomberg https://twitter.com/business
 * Notify them to Slack
 */
export async function subscribeBloombergTask() {
  const interactor = new TwitterSearchToSlackUsecase(
    taskIds.subscribeBloomberg,
    slackChannels.finance
  );
  const data = await interactor.searchByQuery({
    keywords: "(Nasdaq OR Bitcoin OR China OR Japan OR BOJ)",
    theFrom: "from:business",
    notReply: true,
    notRetweet: true,
    maxResults: 30,
  });

  if (!data) return;

  await interactor.postResultsToSlack({
    data,
    firstMessage: `<@kei> You got finance messages from Bloomberg!`,
  });
}
