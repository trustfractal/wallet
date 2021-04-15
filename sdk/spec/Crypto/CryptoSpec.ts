import "jasmine";

import Crypto from "@src/Crypto";
import ClaimType from "@src/ClaimType";
import Claim from "@src/Claim";

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
