import { v4 as uuidv4 } from "uuid";
import { utils as ethersUtils } from "ethers";

import {
  isArray,
  isPlainObject,
  deepSortObject,
  deepSortArray,
} from "../utils";

import FractalError from "../FractalError";
import {
  IClaim,
  HashWithNonce,
  HashTree,
  Signature,
  Address,
  Hash,
} from "../types";

const doHash = (str: string, nonce: string = ""): string => {
  const value = ethersUtils.solidityKeccak256(
    ["string", "string"],
    [nonce, str]
  );

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

const buildHashTreeKey = (prefix: string, suffix: string) =>
  `${prefix}#${suffix}`;

const buildHashableTreeValue = (
  prefix: string,
  key: string,
  value: any
): string => {
  const hashableKey = buildHashTreeKey(prefix, key);

  return JSON.stringify({ [hashableKey]: value });
};

const buildHashTree = ({ properties, claimTypeHash }: IClaim): HashTree =>
  Object.entries(properties).reduce(
    (memo: HashTree, [key, value]: [string, any]) => {
      const hashable = buildHashableTreeValue(claimTypeHash, key, value);

      memo[key] = hashWithNonce(hashable);

      return memo;
    },
    {}
  );

const calculateRootHash = (
  claimHashTree: HashTree,
  claimTypeHash: Hash,
  owner: Address
): string => {
  const sortedHashes = Object.values(claimHashTree)
    .map(({ hash }) => hash)
    .sort();

  const hashable = [...sortedHashes, claimTypeHash, owner].join("");

  return hash(hashable);
};

const verifyHashWithNonce = (
  { hash, nonce }: HashWithNonce,
  source: Address
): boolean => {
  const { hash: expectedHash } = hashWithNonce(source, nonce);

  return hash === expectedHash;
};

const verifySignature = (
  signature: Signature,
  message: string,
  expectedSigner: Address
) => ethersUtils.verifyMessage(message, signature) === expectedSigner;

const verifyClaimHashTree = (
  hashTree: HashTree,
  properties: object,
  prefix: string
) => {
  const validHashes = Object.entries(properties).every(([key, value]) => {
    const hashable = buildHashableTreeValue(prefix, key, value);
    const node = hashTree[key];

    if (!node) return false;

    const { hash, nonce } = node;
    const { hash: expectedHash } = hashWithNonce(hashable, nonce);

    return hash === expectedHash;
  });

  const sameKeys =
    JSON.stringify(Object.keys(properties).sort()) ===
    JSON.stringify(Object.keys(hashTree).sort());

  return validHashes && sameKeys;
};

const verifyPartialClaimHashTree = (
  hashTree: HashTree,
  properties: object,
  prefix: string
) =>
  Object.entries(properties).every(([key, value]) => {
    const hashable = buildHashableTreeValue(prefix, key, value);
    const node = hashTree[key];

    if (!node) return false;

    const { hash, nonce } = hashTree[key];

    if (!nonce) return true;

    const { hash: expectedHash } = hashWithNonce(hashable, nonce);
    return hash === expectedHash;
  });

const verifyRootHash = (
  claimHashTree: HashTree,
  claimTypeHash: Hash,
  owner: Address,
  expectedHash: Hash
) => calculateRootHash(claimHashTree, claimTypeHash, owner) === expectedHash;

export default {
  hash,
  hashWithNonce,
  buildHashTree,
  buildHashTreeKey,
  buildHashableTreeValue,
  calculateRootHash,
  verifyHashWithNonce,
  verifySignature,
  verifyRootHash,
  verifyClaimHashTree,
  verifyPartialClaimHashTree,
};
