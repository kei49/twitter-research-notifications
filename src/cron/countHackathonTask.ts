import TwitterClient from "../common/lib/twitter";

export default async function countHackathonTask() {
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