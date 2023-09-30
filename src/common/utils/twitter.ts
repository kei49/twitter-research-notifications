export const twitterBlackListQueryBuilder = (type: 'user' | 'keyword', list: string[]) => {
  if (type === "user") {
    return list.map((user) => `-from:${user}`).join(" ")
  } else if (type === "keyword") {
    return list.map((keyword) => `-${keyword}`).join(" ")
  }
  return ""
}