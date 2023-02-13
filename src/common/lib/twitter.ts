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
  async searchRecent(
    params: SearchParams,
    likeCountFilter: number,
    next_token?: string
  ) {
    const res = await this.searchRecentAPI({ params, next_token });

    let data = res?.data;
    const nextToken = res?.next_token;

    console.log("searchRecent: ", data?.length, nextToken);

    if (!data) return;

    console.log(
      `Original Twitter search API results count: ${data.length} with next_token as ${nextToken}`
    );

    if (likeCountFilter !== -1) {
      data = data.filter((d) => d.public_metrics.like_count > likeCountFilter);

      console.log(
        `Filtered results count by more than ${likeCountFilter} like_count: ${data.length}`
      );
    }

    return {
      data,
      nextToken,
    };
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

  async searchRecentAPI({
    params,
    next_token,
    count = 1,
  }: {
    params: SearchParams;
    count?: number;
    next_token?: string;
  }): Promise<
    { next_token: string | undefined; data: TweetsSearchData[] } | undefined
  > {
    try {
      const res = await this.get(
        twitterAPI.searchRecentPath,
        next_token ? { ...params, next_token } : params
      );
      const data = res.data;
      const meta = data.meta;

      console.log(
        `@@@@ got the ${data.data?.length} data with next_token: ${meta.next_token}`
      );

      if (count < 10 && meta.next_token) {
        const results = await this.searchRecentAPI({
          params,
          next_token: meta.next_token,
          count: count + 1,
        });

        return {
          next_token: results?.next_token,
          data: [...data.data, ...(results?.data as TweetsSearchData[])],
        };
      } else {
        return {
          next_token: meta.next_token,
          data: data.data,
        };
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
    const withKeywords = keywords ? `${keywords}` : "";
    const from = theFrom ? ` ${theFrom}` : "";
    const withLang = lang ? ` lang:${lang}` : "";
    const hashtags = hasHashtags ? " has:hashtags" : "";
    const links = hasLinks ? " has:links" : "";
    const reply = notReply ? " -is:reply" : "";
    const retweet = notRetweet ? " -is:retweet" : "";
    const query = `${withKeywords}${from}${withLang}${links}${hashtags}${reply}${retweet}`;
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
