import { isArray, isPlainObject } from "./index";

const compare = (a: string, b: string) => {
  switch (true) {
    case a < b:
      return -1;
    case a > b:
      return 1;
    default:
      return 0;
  }
};

export const deepSort = (term: any): any => {
  if (isArray(term)) return deepSortArray(term);
  if (isPlainObject(term)) return deepSortObject(term);
  return term;
};

export const deepSortObject = (obj: Record<string, any>): Record<string, any> =>
  Object.keys(obj)
    .sort((a, b) => {
      const lowA = a.toLowerCase();
      const lowB = b.toLowerCase();

      return compare(lowA, lowB);
    })
    .reduce(
      (memo: Record<string, any>, elem: string) => ({
        ...memo,
        [elem]: deepSort(obj[elem]),
      }),
      {}
    );

export const deepSortArray = (arr: Array<any>): Array<any> =>
  arr.map(deepSort).sort((a, b) => {
    const strA = JSON.stringify(a);
    const strB = JSON.stringify(b);

    return compare(strA, strB);
  });

export default { deepSort, deepSortObject, deepSortArray };
