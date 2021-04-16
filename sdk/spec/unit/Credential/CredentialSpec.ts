import "jasmine";

import Credential from "@src/Credential";

describe("removeProperty", () => {
  it("deletes the property and the corresponding nonce", () => {
    const claimerAddress = "0x0";
    const claimTypeHash = { hash: "0x123", nonce: "0x0" };

    const claimHashTree = {
      age: { hash: "0x1", nonce: "0x2" },
      name: { hash: "0x3", nonce: "0x4" },
    };

    const claim = {
      claimTypeHash: claimTypeHash.hash,
      owner: claimerAddress,
      properties: { age: 20, name: "Foo" },
    };

    const credential = new Credential({
      rootHash: "0x0",
      attesterAddress: null,
      attesterSignature: null,
      claimerSignature: "0x0",
      claimerAddress,
      claimTypeHash,
      claimHashTree,
      claim,
    });

    credential.removeProperty("age");

    expect(credential.claim.properties).toEqual({ name: "Foo" });
    expect(credential.claimHashTree).toEqual({
      name: { hash: "0x3", nonce: "0x4" },
      age: { hash: "0x1" },
    });
  });
});
