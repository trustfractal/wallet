import Web3 from "web3";

import { isArray, isPlainObject, deepSortObject, deepSortArray } from "../utils";

import FractalError from "../FractalError";

const web3 = new Web3();

const doHash = (str: string): string => {
  const value = web3.utils.soliditySha3(str);

  if (value === null)
    throw new FractalError(`Invalid object to be hashed: ${str}`);

  return value;
};

const hashObject = (obj: Record<string, any>) =>
  doHash(JSON.stringify(deepSortObject(obj)));

const hashArray = (obj: Array<any>) =>
  doHash(JSON.stringify(deepSortArray(obj)));

// web3.utils.solidityHash supports, by default, String|Number|Bool|BN To
// support objects or arrays, we need to convert them to string first
const hash = (term: any): string => {
  if (isArray(term)) return hashArray(term);
  if (isPlainObject(term)) return hashObject(term);
  return doHash(term);
};

export default { hash };
