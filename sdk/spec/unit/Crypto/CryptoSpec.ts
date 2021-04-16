import "jasmine";

import Crypto from "@src/Crypto";
import ClaimType from "@src/ClaimType";
import Claim from "@src/Claim";
import Web3 from "web3";

const soliditySha3 = (str: string) => new Web3().utils.soliditySha3(str);

describe("buildHashTree", () => {
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

  it("generates a hash tree", () => {
    const properties = {
      name: "Foo",
      age: 20,
      address: { street: "Tinsel Street", city: "Metropolis" },
    };

    const claim = new Claim(claimType, properties, owner);

    const hashTree = Crypto.buildHashTree(claim);

    Object.keys(properties).forEach((key: string) => {
      expect(hashTree[key].hash).toBeDefined();
      expect(hashTree[key].nonce).toBeDefined();
    });
  });

  it("generates verifiable hashes", () => {
    const properties = {
      name: "Foo",
      age: 20,
      address: { street: "Tinsel Street", city: "Metropolis" },
    };

    const claim = new Claim(claimType, properties, owner);

    const hashTree = Crypto.buildHashTree(claim);

    Object.entries(properties).forEach(([key, value]: [string, any]) => {
      const hashableKey = `${claim.claimTypeHash}#${key}`;
      const hashable = JSON.stringify({ [hashableKey]: value });
      const { nonce, hash } = hashTree[key];

      const { hash: expectedHash } = Crypto.hashWithNonce(hashable, nonce);

      expect(hash).toEqual(expectedHash);
    });
  });
});

describe("calculateRootHash", () => {
  it("correctly calculates the soliditySha3 of the hash tree", () => {
    const hashTree = {
      fieldA: {
        hash: "0x0",
        nonce: "0x0",
      },
      fieldB: {
        hash: "0x1",
        nonce: "0x1",
      },
    };

    const claimTypeHash = "0x2";
    const owner = "0x3";

    const expectedHash = soliditySha3("0x00x10x20x3") || "";

    const hash = Crypto.calculateRootHash(hashTree, claimTypeHash, owner);

    expect(hash).toEqual(expectedHash);
    expect(hash).not.toEqual("");
  });

  it("outputs the same value for computationally equivalent hash trees", () => {
    const hashTree1 = {
      fieldA: {
        hash: "0x0",
        nonce: "0x0",
      },
      fieldB: {
        hash: "0x1",
        nonce: "0x1",
      },
    };

    const hashTree2 = {
      fieldB: {
        hash: "0x1",
        nonce: "0x1",
      },
      fieldA: {
        nonce: "0x0",
        hash: "0x0",
      },
    };

    const claimTypeHash = "0x2";
    const owner = "0x3";

    const hash1 = Crypto.calculateRootHash(hashTree1, claimTypeHash, owner);
    const hash2 = Crypto.calculateRootHash(hashTree2, claimTypeHash, owner);

    expect(hash1).toEqual(hash2);
  });
});
