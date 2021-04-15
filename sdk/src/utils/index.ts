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
