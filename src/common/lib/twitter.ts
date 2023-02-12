import axios from "axios";

import { baseConfig, twitterAPI } from "../../config";
import { BuildQuqeryData } from "../types";
import { convertTimeInJST } from "../utils";

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

export type TweetsSearchData = {
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
  start_time?: Date;
  next_token?: string;
};

type CountSearchParams = {
  query: string;
  granularity: string;
};

export default class TwitterClient {
  async searchRecent(params: SearchParams, likeCountFilter: number) {
    let data = await this.searchRecentAPI(params);

    if (!data) return;

    console.log(`Original Twitter search API results count: ${data.length}`);

    if (likeCountFilter !== -1) {
      data = data.filter((d) => d.public_metrics.like_count > likeCountFilter);

      console.log(
        `Filtered results count by more than ${likeCountFilter} like_count: ${data.length}`
      );
    }

    return data;
  }

  async countRecent(params: CountSearchParams) {
    const { data, totalTweetCount } = await this.countsRecentAPI(params);

    // console.log("block of counts: ", data.length);
    // console.log(data[0], data[data.length - 1]);
    // console.log("total tweet count: ", totalTweetCount);
    const results = data
      .slice(-9)
      .map(
        (d) =>
          `${d.tweet_count} counts by '${
            params.query
          }' query until ${convertTimeInJST(d.end)}`
      );

    console.log("results", results);
    return results;
  }

  async searchRecentAPI(
    params: SearchParams,
    next_token?: string
  ): Promise<TweetsSearchData[] | undefined> {
    try {
      const res = await this.get(
        twitterAPI.searchRecentPath,
        next_token ? { ...params, next_token } : params
      );
      const data = res.data;
      const meta = data.meta;

      console.log(
        `@@@@ got the ${data.data.length} data with next_token: ${meta.next_token}`
      );

      if (meta.next_token) {
        return [
          ...data.data,
          ...((await this.searchRecentAPI(
            params,
            meta.next_token
          )) as TweetsSearchData[]),
        ];
      } else {
        return data.data;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async countsRecentAPI(params: any) {
    const res = await this.get(twitterAPI.countsRecent, params);
    const _data: TweetsCountData = res.data;
    const data = _data.data;
    const totalTweetCount = _data.meta.total_tweet_count;

    return { data, totalTweetCount };
  }

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

  buildQuery({
    keywords,
    theFrom,
    hasHashtags,
    hasLinks,
    notReply,
    notRetweet,
    lang,
  }: BuildQuqeryData) {
    const from = theFrom ? ` ${theFrom}` : "";
    const hashtags = hasHashtags ? "has:hashtags" : "";
    const links = hasLinks ? " has:links" : "";
    const reply = notReply ? " -is:reply" : "";
    const retweet = notRetweet ? " -is:retweet" : "";
    const withLang = lang ? ` lang:${lang}` : "";
    const query = `${keywords}${from}${links}${hashtags}${reply}${retweet}${withLang}`;
    return query;
  }

  buildSearchParams(
    query: string,
    maxResults: number = 10,
    start_time?: Date,
    sinceId?: string
  ): SearchParams {
    const params: SearchParams = {
      query,
      "tweet.fields": "author_id,public_metrics,text,entities",
    };

    if (maxResults) {
      params.max_results = maxResults;
    }

    if (start_time) {
      params.start_time = start_time;
    }

    if (sinceId) {
      params.since_id = sinceId;
    }

    return params;
  }

  buildCountSearchParams(
    query: string,
    granularity: string
  ): CountSearchParams {
    return { query, granularity };
  }
}
