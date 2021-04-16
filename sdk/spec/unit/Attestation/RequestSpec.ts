import "jasmine";
import { Wallet } from "ethers";
import { v4 as uuidv4 } from "uuid";

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

describe("fromClaim", () => {
  const owner = "0x0123";

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

describe("validateClaimerSignature", () => {
  const wallet = Wallet.createRandom();

  const properties = {
    name: "Foo",
    age: 20,
    address: { street: "Tinsel Street", city: "Metropolis" },
  };

  it("is true for valid signatures", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    const claimerSignature = await wallet.signMessage(request.rootHash);
    request.claimerSignature = claimerSignature;

    expect(request.validateClaimerSignature()).toBeTrue();
  });

  it("is false for tampered signatures", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    const claimerSignature = await wallet.signMessage(request.rootHash);
    request.claimerSignature = claimerSignature;

    const otherWallet = Wallet.createRandom();
    const newSignature = await otherWallet.signMessage(request.rootHash);
    request.claimerSignature = newSignature;

    expect(request.validateClaimerSignature()).not.toBeTrue();
  });

  it("is false for tampered addresses", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    const claimerSignature = await wallet.signMessage(request.rootHash);
    request.claimerSignature = claimerSignature;

    const otherWallet = Wallet.createRandom();
    request.claim.owner = otherWallet.address;

    expect(request.validateClaimerSignature()).not.toBeTrue();
  });
});

describe("validateClaimHashTree", () => {
  const wallet = Wallet.createRandom();

  const properties = {
    name: "Foo",
    age: 20,
    address: { street: "Tinsel Street", city: "Metropolis" },
  };

  it("is true for valid claim hash trees", () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    expect(request.validateClaimHashTree()).toBeTrue();
  });

  it("is false for tampered claim hash trees", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    request.claimHashTree.age.hash = "0x0";

    expect(request.validateClaimHashTree()).not.toBeTrue();
  });

  it("is false for tampered claim hash trees nonces", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    request.claimHashTree.age.nonce = "0x0";

    expect(request.validateClaimHashTree()).not.toBeTrue();
  });

  it("is false for tampered claim hash nodes", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    const key = `${request.claimTypeHash}#age`;
    const hashable = JSON.stringify({ [key]: 40 });
    const newAge = Crypto.hashWithNonce(hashable);
    request.claimHashTree.age = newAge;

    expect(request.validateClaimHashTree()).not.toBeTrue();
  });

  it("is false for tampered properties", () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);
    request.claim.properties.age = 40;

    expect(request.validateClaimHashTree()).not.toBeTrue();
  });
});

describe("validateClaimTypeHash", () => {
  const wallet = Wallet.createRandom();

  const properties = {
    name: "Foo",
    age: 20,
    address: { street: "Tinsel Street", city: "Metropolis" },
  };

  it("is true for valid claim hash trees", () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    expect(request.validateClaimTypeHash()).toBeTrue();
  });

  it("is false for tampered claim type hashes", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    request.claimTypeHash.hash = "0x0";

    expect(request.validateClaimTypeHash()).not.toBeTrue();
  });

  it("is false for tampered claim type hash nonces", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    request.claimTypeHash.nonce = uuidv4();

    expect(request.validateClaimTypeHash()).not.toBeTrue();
  });

  it("is false for tampered claims", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    request.claim.claimTypeHash = "0x0";

    expect(request.validateClaimTypeHash()).not.toBeTrue();
  });
});

describe("validateRootHash", () => {
  const wallet = Wallet.createRandom();

  const properties = {
    name: "Foo",
    age: 20,
    address: { street: "Tinsel Street", city: "Metropolis" },
  };

  it("is true for valid claim root hashes", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);
    const claimerSignature = await wallet.signMessage(request.rootHash);
    request.claimerSignature = claimerSignature;

    expect(request.validateRootHash()).toBeTrue();
  });

  it("is false for tampered claim type hashes", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);
    const claimerSignature = await wallet.signMessage(request.rootHash);
    request.claimerSignature = claimerSignature;

    request.claimTypeHash = Crypto.hashWithNonce("0x0");

    expect(request.validateRootHash()).not.toBeTrue();
  });

  it("is false for tampered owners", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    const otherWallet = Wallet.createRandom();
    const newSignature = await otherWallet.signMessage(request.rootHash);
    request.claimerSignature = newSignature;

    request.claim.owner = otherWallet.address;

    expect(request.validateRootHash()).not.toBeTrue();
  });

  it("is false for tampered claim type hash trees", async () => {
    const claim = new Claim(claimType, properties, wallet.address);
    const request = AttestationRequest.fromClaim(claim);

    const newProperties = {
      name: "Bar",
      age: 40,
      address: { street: "Tinsel Street", city: "Metropolis" },
    };

    claim.properties = newProperties;
    const newHashTree = Crypto.buildHashTree(claim);
    request.claimHashTree = newHashTree;

    expect(request.validateRootHash()).not.toBeTrue();
  });
});
