/**
 * isAnd is used for connection between base and li, not used for connection between li elements
 */
export function addListQueryWithOr(base: string, li: string[], isAnd: boolean) {
  let i = 0;
  let query = base;
  while (i < li.length) {
    if (i === 0 && isAnd) {
      query = query + " (" + li[i++];
    }

    query = query + " OR " + li[i++];

    if (i === li.length && isAnd) {
      query = query + ")";
    }
  }
  return query;
}
