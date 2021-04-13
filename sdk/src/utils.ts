export const isArray = (term: any): boolean => Array.isArray(term);

export const isPlainObject = (term: any): boolean =>
  typeof term === "object" &&
  term !== null &&
  term.constructor === Object &&
  Object.prototype.toString.call(term) === "[object Object]";
