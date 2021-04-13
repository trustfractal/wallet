import Web3 from "web3";
import { sortObject, deepSortArray } from "./Crypto.JSON";
import { isArray, isPlainObject } from "../utils";

const web3 = new Web3();

const doHash = (str: string) => web3.utils.soliditySha3(str);

const hashObject = (obj: Record<string, any>) =>
  doHash(JSON.stringify(sortObject(obj)));

const hashArray = (obj: Array<any>) =>
  doHash(JSON.stringify(deepSortArray(obj)));

// web3.utils.solidityHash supports, by default, String|Number|Bool|BN To
// support objects or arrays, we need to convert them to string first
//
// TODO: if it's null should we throw an error?
const hash = (term: any): string | null => {
  if (isArray(term)) return hashArray(term);
  if (isPlainObject(term)) return hashObject(term);
  return doHash(term);
};

export default { hash };
