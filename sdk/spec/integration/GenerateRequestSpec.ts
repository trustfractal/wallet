import "jasmine";
import { Wallet } from "ethers";

import AttestationRequest from "../../src/AttestationRequest";
import Claim from "../../src/Claim";
import ClaimType from "../../src/ClaimType";

const BasicLivenessSchema = ClaimType.buildSchema("basic+liveness", {
  residential_address_country: { type: "string" },
  date_of_birth: { type: "string" },
  full_name: { type: "string" },
  identification_document_country: { type: "string" },
  identification_document_number: { type: "string" },
  identification_document_type: { type: "string" },
  liveness: { type: "boolean" },
});

describe("generate a request", () => {
  it("results in a valid AttestationRequest", async () => {
    // Create the necessary ethereum accounts
    const wallet = Wallet.createRandom();

    // Generate a claim type
    const claimType = ClaimType.fromSchema(BasicLivenessSchema);

    // Create a claim with our data
    const properties = {
      residential_address_country: "NZ",
      date_of_birth: "1990-01-01",
      full_name: "JOHN CITIZEN",
      identification_document_country: "NZ",
      identification_document_number: "00000000",
      identification_document_type: "passport",
      liveness: true,
    };

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
