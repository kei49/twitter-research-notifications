import TwitterClient from "../common/lib/twitter";
import { addListQueryWithOr } from "../common/utils";
import * as slackServices from "../common/services/slack.service";
import { taskIds } from "../config";
import TaskLocalStorage from "../common/localStorage";

export default async function searchHackathonTask() {
  const twitterClient = new TwitterClient();

  const blockchainKeywords = [
    "ブロックチェーン OR Blockchain",
    "NFT OR web3",
    "BTC OR ETH OR USDT OR BNB OR USDC OR XRP OR ADA OR SOL OR LUNA OR AVAX OR DOT OR MATIC OR ATOM OR LINK OR TRX", // Crypto1
    "UNI OR ALGO OR MANA OR XLM OR FTM OR ENJ", // Crypto2
    "MATIC OR LRC OR OMG OR BNT OR ZRX OR SKL OR PERP OR IMX OR CELR OR ZKS", // Layer2 https://www.okx.com/markets/prices/layer2-cryptocurrency
    "WBTC OR LINK OR UNI OR GRT OR AAVE OR MKR OR LRC OR CHZ OR CRV", // Defi https://www.okx.com/markets/prices/defi-cryptocurrency
    "DOT OR LINK OR MXC OR GLMR OR POLS OR ASTR OR CFG OR PHA OR OM OR DORA OR RFUEL OR KONO", // Polkadot https://www.okx.com/markets/prices/polkadot-cryptocurrency
    // "MANA OR SAND OR FLOW OR ENJ OR OMI OR CHZ OR APENFT OR LOOKS OR DEP OR GHST OR AGLD OR EFI OR TRA OR CELT", // NFT https://www.okx.com/markets/prices/nft-cryptocurrency
  ];

  const hackathonKeyword = "ハッカソン OR Hackathon";

  const keywords = addListQueryWithOr(
    hackathonKeyword,
    blockchainKeywords,
    true
  );
  console.log(keywords);

  const taskLocalStorage = new TaskLocalStorage(taskIds.searchHackathon);

  const sinceId = taskLocalStorage.get("lastId") || undefined;
  console.log("sinceId: ", sinceId);

  const data = await twitterClient.searchRecent(keywords, sinceId, 100, 10);
  console.log("Number of data: ", data.length);

  if (data.length === 0) return;

  const lastId = data[0].id;
  taskLocalStorage.set("lastId", lastId);

  const links = data.map(
    (d) => `https://twitter.com/${d.author_id}/status/${d.id}`
  );

  const slackBlocks = links.map((link) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<${link}|${link}>`,
    },
  }));

  await slackServices.sendMessage(slackBlocks);
}
