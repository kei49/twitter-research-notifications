import { chatGPTKeywords } from "../../common/constants";
import TwitterCountSearchToSlackUsecase from "../../usecase/TwitterCountSearchToSlackUsecase";

export async function countChatGPTTask() {
  const interactor = new TwitterCountSearchToSlackUsecase();
  const results = await interactor.searchByQuery({
    keywords: chatGPTKeywords,
    theFrom: undefined,
    hasLinks: true,
    notReply: true,
    notRetweet: true,
    granularity: "day",
  });
}
