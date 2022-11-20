import axios from "axios";

import { baseConfig, twitterAPI } from "../../config";

type TweetsCountData = {
  data: {
    end: string;
    start: string;
    tweet_count: number;
  }[];
  meta: {
    total_tweet_count: number;
  };
};

type TweetsSearchData = {
  id: string;
  author_id: string;
  text: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  entities?: any;
};

type SearchParams = {
  query: string;
  "tweet.fields": any;
  since_id?: string;
  max_results?: number;
};

export default class TwitterClient {
  private async get(path: string, params?: any) {
    const url = twitterAPI.basePath + path;
    const headers = { authorization: `Bearer ${baseConfig.token}` };

    console.log("requesting to ", url, headers, params);

    if (params) {
      const res = await axios.get(url, { params, headers });
      return res;
    }

    return await axios.get(url, { headers });
  }

  async searchRecentAPI(params: SearchParams) {
    const res = await this.get(twitterAPI.searchRecentPath, params);
    console.log("@@@@ res", res);

    const data: TweetsSearchData[] = res.data.data;
    return data;
  }

  async countsRecentAPI(params: any) {
    const res = await this.get(twitterAPI.countsRecent, params);
    const _data: TweetsCountData = res.data;
    const data = _data.data;
    const totalTweetCount = _data.meta.total_tweet_count;

    return { data, totalTweetCount };
  }

  async searchRecent(
    keywords: string,
    sinceId?: string,
    maxResults: number = 10,
    likeCountFilter: number = -1,
    theFrom?: string,
    hasHashtags?: boolean,
    hasLinks?: boolean,
    notReply?: boolean,
    notRetweet?: boolean
  ) {
    const from = theFrom ? ` ${theFrom}` : ""
    const hashtags = hasHashtags ? "has:hashtags" : "";
    const links = hasLinks ? " has:links" : "";
    const reply = notReply ? " -is:reply" : "";
    const retweet = notRetweet ? " -is:retweet" : "";

    const params: SearchParams = {
      query: `${keywords}${from}${links}${hashtags}${reply}${retweet}`,
      "tweet.fields": "author_id,public_metrics,text,entities",
    };

    if (maxResults) {
      params.max_results = maxResults;
    }

    if (sinceId) {
      params.since_id = sinceId;
    }

    let data = await this.searchRecentAPI(params);

    if (likeCountFilter !== -1) {
      data = data.filter((d) => d.public_metrics.like_count > likeCountFilter);
    }

    return data;
  }

  async countsRecent(params: any) {
    const { data, totalTweetCount } = await this.countsRecentAPI(params);

    console.log("block of counts: ", data.length);
    console.log(data[0], data[data.length - 1]);

    data.map((d) => console.log(`count until ${d.end}: ${d.tweet_count}`));

    console.log("total tweet count: ", totalTweetCount);
  }
}
