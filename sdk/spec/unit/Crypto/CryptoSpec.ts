import "jasmine";
import { Wallet } from "ethers";

import Crypto from "../../../src/Crypto";
import ClaimType from "../../../src/ClaimType";
import Claim from "../../../src/Claim";
import { utils as ethersUtils } from "ethers";

const soliditySha3 = (str: string) =>
  ethersUtils.solidityKeccak256(["string"], [str]);

const buildHashTree = () => {
  const claimTypeHash = "0x0";
  const properties = {
    name: "Foo",
    age: 20,
  };

  const hashTree = Crypto.buildHashTree({
    properties,
    claimTypeHash,
    owner: "0x0",
  });

  return { hashTree, properties, prefix: claimTypeHash };
};

const buildRootHash = () => {
  const owner = "0x0";
  const claimTypeHash = "0x1";
  const { hashTree } = buildHashTree();

  const rootHash = Crypto.calculateRootHash(hashTree, claimTypeHash, owner);

  return {
    rootHash,
    hashTree,
    owner,
    claimTypeHash,
  };
};

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

describe("verifyHashWithNonce", () => {
  it("is true for valid claim type hashes", () => {
    const hashWithNonce = Crypto.hashWithNonce("foo");

    const result = Crypto.verifyHashWithNonce(hashWithNonce, "foo");

    expect(result).toBeTrue();
  });

  it("is false for tampered hashes", () => {
    const { nonce } = Crypto.hashWithNonce("foo");

    const result = Crypto.verifyHashWithNonce({ hash: "fake", nonce }, "foo");

    expect(result).not.toBeTrue();
  });

  it("is false for tampered hashes nonces", () => {
    const { hash } = Crypto.hashWithNonce("foo");

    const result = Crypto.verifyHashWithNonce({ hash, nonce: "fake" }, "foo");

    expect(result).not.toBeTrue();
  });

  it("is false for different messages", () => {
    const hashWithNonce = Crypto.hashWithNonce("foo");

    const result = Crypto.verifyHashWithNonce(hashWithNonce, "bar");

    expect(result).not.toBeTrue();
  });
});

describe("verifySignature", async () => {
  const wallet = Wallet.createRandom();
  const otherWallet = Wallet.createRandom();

  it("is true for valid signatures", async () => {
    const signature = await wallet.signMessage("foo");

    const result = Crypto.verifySignature(signature, "foo", wallet.address);

    expect(result).toBeTrue();
  });

  it("is false for other messages", async () => {
    const signature = await wallet.signMessage("foo");

    const result = Crypto.verifySignature(signature, "bar", wallet.address);

    expect(result).not.toBeTrue();
  });

  it("is false for tampered signatures", async () => {
    const signature = await otherWallet.signMessage("foo");

    const result = Crypto.verifySignature(signature, "foo", wallet.address);

    expect(result).not.toBeTrue();
  });

  it("is false for tampered addresses", async () => {
    const signature = await wallet.signMessage("foo");

    const result = Crypto.verifySignature(
      signature,
      "foo",
      otherWallet.address
    );

    expect(result).not.toBeTrue();
  });
});

describe("verifyClaimHashTree", () => {
  it("is true for valid claim hash trees", () => {
    const { hashTree, properties, prefix } = buildHashTree();

    const result = Crypto.verifyClaimHashTree(hashTree, properties, prefix);

    expect(result).toBeTrue();
  });

  it("is false for tampered claim hash trees", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [key, ..._rest] = Object.keys(properties);

    hashTree[key].hash = "tampered";

    const result = Crypto.verifyClaimHashTree(hashTree, properties, prefix);

    expect(result).not.toBeTrue();
  });

  it("is false for tampered claim hash trees nonces", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [key, ..._rest] = Object.keys(properties);

    hashTree[key].nonce = "tampered";

    const result = Crypto.verifyClaimHashTree(hashTree, properties, prefix);

    expect(result).not.toBeTrue();
  });

  it("is false for tampered claim hash trees nodes", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [[key, value], ..._rest] = Object.entries(properties);

    const hashable = Crypto.buildHashableTreeValue(
      prefix,
      key,
      value + "tampered"
    );

    hashTree[key] = Crypto.hashWithNonce(hashable);

    const result = Crypto.verifyClaimHashTree(hashTree, properties, prefix);

    expect(result).not.toBeTrue();
  });

  it("is false for added claim hash trees nodes", () => {
    const { hashTree, properties, prefix } = buildHashTree();

    const hashable = Crypto.buildHashableTreeValue(prefix, "tampered", "value");
    hashTree["tampered"] = Crypto.hashWithNonce(hashable);

    const result = Crypto.verifyClaimHashTree(hashTree, properties, prefix);

    expect(result).not.toBeTrue();
  });

  it("is false for missing claim hash trees nodes", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [key, ..._rest] = Object.keys(properties);

    delete hashTree[key];

    const result = Crypto.verifyClaimHashTree(hashTree, properties, prefix);

    expect(result).not.toBeTrue();
  });

  it("is false for tampered properties", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [key, ..._rest] = Object.keys(properties);

    // @ts-ignore
    properties[key] = "tampered";

    const result = Crypto.verifyClaimHashTree(hashTree, properties, prefix);

    expect(result).not.toBeTrue();
  });

  it("is false for added properties", () => {
    const { hashTree, properties, prefix } = buildHashTree();

    // @ts-ignore
    properties["tampered"] = "value";

    const result = Crypto.verifyClaimHashTree(hashTree, properties, prefix);

    expect(result).not.toBeTrue();
  });

  it("is false for missing properties", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [key, ..._rest] = Object.keys(properties);

    // @ts-ignore
    delete properties[key];

    const result = Crypto.verifyClaimHashTree(hashTree, properties, prefix);

    expect(result).not.toBeTrue();
  });
});

describe("verifyPartialClaimHashTree", () => {
  it("is true for valid claim hash trees", () => {
    const { hashTree, properties, prefix } = buildHashTree();

    const result = Crypto.verifyPartialClaimHashTree(
      hashTree,
      properties,
      prefix
    );

    expect(result).toBeTrue();
  });

  it("is true for claim hash trees with nonces removed", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [key, ..._rest] = Object.keys(properties);

    // @ts-ignore
    delete properties[key];
    delete hashTree[key].nonce;

    const result = Crypto.verifyPartialClaimHashTree(
      hashTree,
      properties,
      prefix
    );

    expect(result).toBeTrue();
  });

  it("is false for tampered claim hash trees", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [key, ..._rest] = Object.keys(properties);

    hashTree[key].hash = "tampered";

    const result = Crypto.verifyPartialClaimHashTree(
      hashTree,
      properties,
      prefix
    );

    expect(result).not.toBeTrue();
  });

  it("is false for tampered claim hash trees nonces", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [key, ..._rest] = Object.keys(properties);

    hashTree[key].nonce = "tampered";

    const result = Crypto.verifyPartialClaimHashTree(
      hashTree,
      properties,
      prefix
    );

    expect(result).not.toBeTrue();
  });

  it("is false for tampered claim hash trees nodes", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [[key, value], ..._rest] = Object.entries(properties);

    const hashable = Crypto.buildHashableTreeValue(
      prefix,
      key,
      value + "tampered"
    );

    hashTree[key] = Crypto.hashWithNonce(hashable);

    const result = Crypto.verifyPartialClaimHashTree(
      hashTree,
      properties,
      prefix
    );

    expect(result).not.toBeTrue();
  });

  it("is false for missing claim hash trees nodes", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [key, ..._rest] = Object.keys(properties);

    delete hashTree[key];

    const result = Crypto.verifyPartialClaimHashTree(
      hashTree,
      properties,
      prefix
    );

    expect(result).not.toBeTrue();
  });

  it("is false for tampered properties", () => {
    const { hashTree, properties, prefix } = buildHashTree();
    const [key, ..._rest] = Object.keys(properties);

    // @ts-ignore
    properties[key] = "tampered";

    const result = Crypto.verifyPartialClaimHashTree(
      hashTree,
      properties,
      prefix
    );

    expect(result).not.toBeTrue();
  });

  it("is false for added properties", () => {
    const { hashTree, properties, prefix } = buildHashTree();

    // @ts-ignore
    properties["tampered"] = "value";

    const result = Crypto.verifyPartialClaimHashTree(
      hashTree,
      properties,
      prefix
    );

    expect(result).not.toBeTrue();
  });
});

describe("validateRootHash", () => {
  it("is true for valid claim root hashes", () => {
    const { rootHash, owner, claimTypeHash, hashTree } = buildRootHash();

    const result = Crypto.verifyRootHash(
      hashTree,
      claimTypeHash,
      owner,
      rootHash
    );

    expect(result).toBeTrue();
  });

  it("is falsed for tampered claim type hashes", () => {
    const { rootHash, owner, claimTypeHash, hashTree } = buildRootHash();

    const result = Crypto.verifyRootHash(
      hashTree,
      claimTypeHash + "tampered",
      owner,
      rootHash
    );

    expect(result).not.toBeTrue();
  });

  it("is falsed for tampered owners", () => {
    const { rootHash, owner, claimTypeHash, hashTree } = buildRootHash();

    const result = Crypto.verifyRootHash(
      hashTree,
      claimTypeHash,
      owner + "tampered",
      rootHash
    );

    expect(result).not.toBeTrue();
  });

  it("is false for tampered claim hash trees", () => {
    const { rootHash, owner, claimTypeHash, hashTree } = buildRootHash();
    const [key, _rest] = Object.keys(hashTree);
    hashTree[key].hash = "tampered";

    const result = Crypto.verifyRootHash(
      hashTree,
      claimTypeHash,
      owner,
      rootHash
    );

    expect(result).not.toBeTrue();
  });
});
