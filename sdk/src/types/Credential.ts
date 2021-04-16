import { Address, Hash, Signature, HashWithNonce, HashTree } from "./base";
import { IClaim } from "./Claim";

export interface ICredential {
  claim: IClaim;
  rootHash: Hash;
  attesterAddress: Address | null;
  attesterSignature: Signature | null;
  claimerAddress: Address;
  claimerSignature: Signature;
  claimTypeHash: HashWithNonce;
  claimHashTree: HashTree;
}
