import { Address, Hash, Signature, HashWithNonce, HashTree, ISerializable } from "./Common";
import { IClaim } from "./Claim";
export interface ICredential extends ISerializable {
    id: String;
    claim: IClaim;
    rootHash: Hash;
    attesterAddress: Address | null;
    attesterSignature: Signature | null;
    claimerAddress: Address;
    claimerSignature: Signature;
    claimTypeHash: HashWithNonce;
    claimHashTree: HashTree;
}
