import { isArray, isPlainObject } from "../utils";

export const deepSort = (term: any): any => {
  if (isArray(term)) return deepSortArray(term);
  if (isPlainObject(term)) return sortObject(term);
  return term;
};

export const sortObject = (obj: Record<string, any>): Record<string, any> =>
  Object.keys(obj)
    .sort((a, b) => {
      const lowA = a.toLowerCase();
      const lowB = b.toLowerCase();

      return lowA < lowB ? -1 : lowA > lowB ? 1 : 0;
    })
    .reduce(
      (memo: Record<string, any>, elem: string) =>
        (memo[elem] = obj[elem] && memo),
      {}
    );

// TODO: should I recursively call deepSort here?
export const deepSortArray = (arr: Array<any>): Array<any> =>
  arr.map(deepSort).sort((a, b) => {
    const strA = JSON.stringify(a);
    const strB = JSON.stringify(b);

    return strA < strB ? -1 : strA > strB ? 1 : 0;
  });
