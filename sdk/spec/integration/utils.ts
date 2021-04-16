import "jasmine";
import Web3 from "web3";
import { utils as ethersUtils } from "ethers";

import Crypto from "@src/Crypto";
import { Address, IAttestationRequest } from "@src/types";
import { deepSortObject } from "@src/utils";

const soliditySha3 = (str: string) => new Web3().utils.soliditySha3(str);

const validateHashTree = (
  properties: object,
  attestationRequest: IAttestationRequest
) => {
  Object.entries(properties).forEach(([key, value]: [string, any]) => {
    const hashableKey = `${attestationRequest.claim.claimTypeHash}#${key}`;
    const hashable = JSON.stringify({ [hashableKey]: value });
    const { nonce, hash } = attestationRequest.claimHashTree[key];

    const { hash: expectedHash } = Crypto.hashWithNonce(hashable, nonce);

    expect(hash).toEqual(expectedHash);
  });
};

const validateClaimTypeHash = (
  { claimTypeHash: { nonce, hash } }: IAttestationRequest,
  claimTypeHash: string
) => {
  const { hash: expectedHash } = Crypto.hashWithNonce(claimTypeHash, nonce);

  expect(hash).toEqual(expectedHash);
};

const validateRootHash = ({
  rootHash,
  claimTypeHash: { hash: claimTypeHash },
  claimHashTree,
  claim: { owner },
}: IAttestationRequest) => {
  const sortedHashTree = Object.values(deepSortObject(claimHashTree))
    .map(({ hash }: { hash: string }) => hash)
    .sort();
  const hashes = [...sortedHashTree, claimTypeHash, owner].join("");

  const expectedRootHash = soliditySha3(hashes) || "";

  expect(rootHash).toEqual(expectedRootHash);
};

const validateClaimerSignature = (
  request: IAttestationRequest,
  expectedSigner: Address
) => {
  const signer = ethersUtils.verifyMessage(
    request.rootHash,
    request.claimerSignature || ""
  );
  expect(signer).toEqual(expectedSigner);
};

export default {
  soliditySha3,
  validateHashTree,
  validateClaimTypeHash,
  validateRootHash,
  validateClaimerSignature,
};
