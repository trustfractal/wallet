import sort from "./sort";

export * from "./sort";

export const isArray = (term: any): boolean => Array.isArray(term);

export const isPlainObject = (term: any): boolean =>
  typeof term === "object" &&
  term !== null &&
  term.constructor === Object &&
  Object.prototype.toString.call(term) === "[object Object]";

export const normaliseObject = (obj: any) => {
  return Object.entries(obj).map(([key, value]) =>
    JSON.stringify({ [key]: value })
  );
};

export const compareObjects = (objA: object, objB: object) => {
  const sortedA = sort.deepSortObject(objA);
  const sortedB = sort.deepSortObject(objB);

  const strA = JSON.stringify(sortedA);
  const strB = JSON.stringify(sortedB);

  return strA === strB;
};

export default { isArray, isPlainObject, compareObjects, Sort: sort };
