import { Hash, Signature, HashWithNonce, HashTree } from "./base";
import { IClaim } from "./Claim";

export interface IAttestationRequest {
  claim: IClaim;
  claimerSignature?: Signature;
  claimHashTree: HashTree;
  claimTypeHash: HashWithNonce;
  rootHash: Hash;
}
