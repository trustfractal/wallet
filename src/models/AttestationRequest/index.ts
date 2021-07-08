import { AttestationRequest as SDKAttestationRequest } from "@trustfractal/sdk";
import { IAttestationRequest } from "@pluginTypes/index";

export default class AttestationRequest
  extends SDKAttestationRequest
  implements IAttestationRequest
{
  constructor(attestationRequest: SDKAttestationRequest) {
    super({
      claim: attestationRequest.claim,
      claimerSignature: attestationRequest.claimerSignature,
      claimHashTree: attestationRequest.claimHashTree,
      claimTypeHash: attestationRequest.claimTypeHash,
      rootHash: attestationRequest.rootHash,
    });
  }

  public serialize(): string {
    return JSON.stringify({
      claim: this.claim,
      claimerSignature: this.claimerSignature,
      claimHashTree: this.claimHashTree,
      claimTypeHash: this.claimTypeHash,
      rootHash: this.rootHash,
    });
  }

  public static parse(str: string): AttestationRequest {
    const { claim, claimerSignature, claimHashTree, claimTypeHash, rootHash } =
      JSON.parse(str);

    const sdkAttestationRequest = new SDKAttestationRequest({
      claim,
      claimerSignature,
      claimHashTree,
      claimTypeHash,
      rootHash,
    });

    return new AttestationRequest(sdkAttestationRequest);
  }
}
