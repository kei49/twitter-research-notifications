// import cron from "node-cron";
// import startCron from "./cron";
import TwitterClient from "./twitter";

(async function () {
  const twitterClient = new TwitterClient();

  const countsTest2 = {
    'query': 'ハッカソン',
    'granularity': 'day' // 'minute', 'hour', 'day'
  }

  const countsTest3 = {
    'query': 'ハッカソン has:links has:hashtags',
    'granularity': 'day'
  }

  const blockchainKeywords = [
    "ブロックチェーン OR Blockchain",
    "NFT OR web3",
    "BTC OR ETH OR USDT OR BNB OR USDC OR XRP OR ADA OR SOL OR LUNA OR AVAX OR DOT OR MATIC OR ATOM OR LINK OR TRX", // Crypto1
    "UNI OR ALGO OR MANA OR XLM OR FTM OR ENJ", // Crypto2
    "MATIC OR LRC OR OMG OR BNT OR ZRX OR SKL OR PERP OR IMX OR CELR OR ZKS", // Layer2 https://www.okx.com/markets/prices/layer2-cryptocurrency
    "WBTC OR LINK OR UNI OR GRT OR AAVE OR MKR OR LRC OR CHZ OR CRV", // Defi https://www.okx.com/markets/prices/defi-cryptocurrency
    "DOT OR LINK OR MXC OR GLMR OR POLS OR ASTR OR CFG OR PHA OR OM OR DORA OR RFUEL OR KONO", // Polkadot https://www.okx.com/markets/prices/polkadot-cryptocurrency
    // "MANA OR SAND OR FLOW OR ENJ OR OMI OR CHZ OR APENFT OR LOOKS OR DEP OR GHST OR AGLD OR EFI OR TRA OR CELT", // NFT https://www.okx.com/markets/prices/nft-cryptocurrency
  ]

  const keywordsSearch1 = "ハッカソン OR Hackathon"

  const keywords = addListQueryWithOr(keywordsSearch1, blockchainKeywords, true);
  console.log(keywords);

  // await twitterClient.countsRecent(paramsTest3);

  await twitterClient.searchRecent(keywords, 100, 10);
})();

/**
 * isAnd is used for connection between base and li, not used for connection between li elements
 */
function addListQueryWithOr(base: string, li: string[], isAnd: boolean) {
  let i = 0;
  let query = base;
  while(i < li.length) {
    if (i === 0 && isAnd) {
      query = query + " (" + li[i++];
    }

    query = query + " OR " + li[i++];

    if (i === li.length && isAnd) {
      query = query + ")"
    }
  }
  return query;
}