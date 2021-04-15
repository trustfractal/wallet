import { Signature } from "./base";
import { IClaim, IClaimHashNode, IClaimHashTree } from "./Claim";

export interface IAttestationRequest {
  claim: IClaim;
  claimerSignature?: Signature;
  claimHashTree: IClaimHashTree;
  claimTypeHash: IClaimHashNode;
  rootHash: IClaimHashNode;
}
