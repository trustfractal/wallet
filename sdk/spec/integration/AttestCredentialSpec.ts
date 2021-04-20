import "jasmine";
import { Wallet } from "ethers";

import AttestationRequest from "@src/AttestationRequest";
import Claim from "@src/Claim";
import ClaimType from "@src/ClaimType";
import Credential from "@src/Credential";

describe("attesting a credential", () => {
  it("results in a verifiable Credential object", async () => {
    // Create the necessary ethereum accounts
    const claimerWallet = Wallet.createRandom();
    const attesterWallet = Wallet.createRandom();

    // Generate a claim type
    const pseudoSchema = ClaimType.buildSchema("Foo", {
      name: { type: "string" },
      age: { type: "number" },
    });

    const claimType = ClaimType.fromSchema(pseudoSchema);

    // Create a claim with our data
    const properties = { name: "Foo", age: 20 };
    const claim = new Claim(claimType, properties, claimerWallet.address);

    // Generate an AttestationRequest
    const request = AttestationRequest.fromClaim(claim);

    // Asynchronously set the signature
    const claimerSignature = await claimerWallet.signMessage(request.rootHash);
    request.claimerSignature = claimerSignature;

    // Run the expectations: all fields are defined && valid
    expect(request.claimerSignature).toBeDefined();
    expect(request.claim).toBeDefined();
    expect(request.claimHashTree).toBeDefined();
    expect(request.claimTypeHash).toBeDefined();
    expect(request.rootHash).toBeDefined();
    expect(request.validate()).toBeTrue();

    // As an attester generate a credential
    const credential = Credential.fromRequest(request);
    const attesterSignature = await attesterWallet.signMessage(
      credential.rootHash
    );

    credential.attesterAddress = attesterWallet.address;
    credential.attesterSignature = attesterSignature;

    expect(credential.verifyIntegrity()).toBeTrue();

    // As the user, remove the property from the credential
    credential.removeProperty("name");

    expect(credential.getProperty("age")).toBeDefined();
    expect(credential.getProperty("name")).not.toBeDefined();

    // As the publisher, ensure the integrity of data
    expect(credential.verifyIntegrity()).toBeTrue();
  });
});
