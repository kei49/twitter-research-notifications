import TwitterClient from "../../common/lib/twitter";

export async function countChatGPTTask() {
  const twitterClient = new TwitterClient();
  const interestCounts = {
    query: "ChatGPT",
    granularity: "hour",
  };

  const results = await twitterClient.countsRecent(interestCounts);
  console.log("@@@@ results", results);
}
