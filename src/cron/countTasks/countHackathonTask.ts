import TwitterClient from "../../common/lib/twitter";

export async function countHackathonTask() {
  const twitterClient = new TwitterClient();

  const countsTest = {
    query: "ハッカソン",
    granularity: "day", // 'minute', 'hour', 'day'
  };

  const countsTest2 = {
    query: "ハッカソン has:links has:hashtags",
    granularity: "day",
  };

  const countsTest3 = {
    query: "interest rate",
    granularity: "hour",
  };

  await twitterClient.countRecent(countsTest3);
}
