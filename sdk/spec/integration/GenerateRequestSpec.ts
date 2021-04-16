import "jasmine";
import { Wallet } from "ethers";

import AttestationRequest from "@src/AttestationRequest";
import Claim from "@src/Claim";
import ClaimType from "@src/ClaimType";

describe("generate a request", () => {
  it("results in a valid AttestationRequest", async () => {
    // Create the necessary ethereum accounts
    const wallet = Wallet.createRandom();

    // Generate a claim type
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const claimType = ClaimType.fromSchema(pseudoSchema);

    // Create a claim with our data
    const properties = { name: "Foo", age: 20 };
    const claim = new Claim(claimType, properties, wallet.address);

    // Generate an AttestationRequest
    const request = AttestationRequest.fromClaim(claim);

    // Asynchronously set the signature
    const claimerSignature = await wallet.signMessage(request.rootHash);
    request.claimerSignature = claimerSignature;

    // Run the expectations: all fields are defined && valid
    expect(request.claimerSignature).toBeDefined();
    expect(request.claim).toBeDefined();
    expect(request.claimHashTree).toBeDefined();
    expect(request.claimTypeHash).toBeDefined();
    expect(request.rootHash).toBeDefined();
    expect(request.validate()).toBeTrue();
  });
});
