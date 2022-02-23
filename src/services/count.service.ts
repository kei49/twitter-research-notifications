import TwitterClient from "../twitter";

export async function countHackathon() {
  const twitterClient = new TwitterClient();

  const countsTest = {
    'query': 'ハッカソン',
    'granularity': 'day' // 'minute', 'hour', 'day'
  }

  const countsTest2 = {
    'query': 'ハッカソン has:links has:hashtags',
    'granularity': 'day'
  }

  await twitterClient.countsRecent(countsTest2);
}