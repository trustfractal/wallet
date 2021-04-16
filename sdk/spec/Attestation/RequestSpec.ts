import "jasmine";

import Crypto from "@src/Crypto";
import ClaimType from "@src/ClaimType";
import Claim from "@src/Claim";
import AttestationRequest from "@src/Attestation/Request";
import { IAttestationRequest } from "@src/types";

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

describe("fromClaim", () => {
  const pseudoSchema = ClaimType.buildSchema("Foo", {
    name: { type: "string" },
    age: { type: "number" },
    address: {
      type: "object",
      properties: {
        street: { type: "string" },
        city: { type: "string" },
      },
    },
  });

  const claimType = ClaimType.fromSchema(pseudoSchema);
  const owner = "0x0";

  it("generates verifiable hashes", () => {
    const properties = {
      name: "Foo",
      age: 20,
      address: { street: "Tinsel Street", city: "Metropolis" },
    };

    const claim = new Claim(claimType, properties, owner);

    const attestationRequest = AttestationRequest.fromClaim(claim);

    validateHashTree(properties, attestationRequest);
    validateClaimTypeHash(attestationRequest, claim.claimTypeHash);
  });
});
