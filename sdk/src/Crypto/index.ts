import Web3 from "web3";
import { v4 as uuidv4 } from "uuid";

import {
  isArray,
  isPlainObject,
  deepSortObject,
  deepSortArray,
} from "../utils";

import FractalError from "../FractalError";
import { IClaim, HashWithNonce, HashTree } from "@src/types";

const web3 = new Web3();

const doHash = (str: string, nonce: string = ""): string => {
  const value = web3.utils.soliditySha3(nonce + str);

  if (value === null) throw FractalError.invalidHashing(str);

  return value;
};

const hashObject = (obj: Record<string, any>, nonce: string = "") =>
  doHash(nonce + JSON.stringify(deepSortObject(obj)));

const hashArray = (obj: Array<any>, nonce: string = "") =>
  doHash(nonce + JSON.stringify(deepSortArray(obj)));

// web3.utils.solidityHash supports, by default, String|Number|Bool|BN To
// support objects or arrays, we need to convert them to string first
const hash = (term: any): string => {
  switch (true) {
    case isArray(term):
      return hashArray(term);
    case isPlainObject(term):
      return hashObject(term);
    default:
      return doHash(term);
  }
};

const hashWithNonce = (
  term: any,
  nonce?: string
): { nonce: string; hash: string } => {
  nonce = nonce || uuidv4();

  switch (true) {
    case isArray(term):
      return { nonce, hash: hashArray(term, nonce) };
    case isPlainObject(term):
      return { nonce, hash: hashObject(term, nonce) };
    default:
      return { nonce, hash: doHash(term, nonce) };
  }
};

const buildHashTree = ({ properties, claimTypeHash }: IClaim): HashTree =>
  Object.entries(properties).reduce(
    (memo: HashTree, [key, value]: [string, any]) => {
      const hashableKey = `${claimTypeHash}#${key}`;
      const hashableValue = JSON.stringify({ [hashableKey]: value });

      const hashedProperty: HashWithNonce = hashWithNonce(hashableValue);

      memo[key] = hashedProperty;

      return memo;
    },
    {}
  );

const calculateRootHash = (
  claimHashTree: HashTree,
  claimTypeHash: string,
  owner: string
): string => {
  const sortedTree = deepSortObject(claimHashTree);
  const sortedHashes = Object.values(sortedTree).map(({ hash }) => hash).sort();

  const hashable = [...sortedHashes, claimTypeHash, owner].join("");

  return hash(hashable);
};

export default { hash, hashWithNonce, buildHashTree, calculateRootHash };
