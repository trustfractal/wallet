import { AttestedClaim as SDKAttestedClaim } from "@trustfractal/sdk";
import {
  ICredential,
  ITransactionDetails,
  ISerializable,
} from "@pluginTypes/index";

import TransactionDetails from "@models/Transaction/TransactionDetails";

import CredentialStatus from "./status";

export default class Credential
  extends SDKAttestedClaim
  implements ICredential, ISerializable
{
  public id: string;
  public level: string;
  public transaction?: ITransactionDetails;
  public valid: boolean;
  public status: CredentialStatus;

  public constructor(
    credential: SDKAttestedClaim,
    id: string,
    level: string,
    status?: CredentialStatus,
    transaction?: ITransactionDetails,
    valid: boolean = false,
  ) {
    super({
      claim: credential.claim,
      rootHash: credential.rootHash,
      attestedClaimHash: credential.attestedClaimHash,
      attestedClaimSignature: credential.attestedClaimSignature,
      attesterAddress: credential.attesterAddress,
      attesterSignature: credential.attesterSignature,
      claimerAddress: credential.claimerAddress,
      claimerSignature: credential.claimerSignature,
      claimTypeHash: credential.claimTypeHash,
      claimHashTree: credential.claimHashTree,
    });
    this.id = id;
    this.level = level;
    this.transaction = transaction;
    this.valid = valid;

    if (status !== undefined) {
      this.status = status;
    } else {
      if (this.valid) {
        this.status = CredentialStatus.VALID;
      } else {
        this.status = CredentialStatus.INVALID;
      }
    }
  }

  public serialize(): string {
    return JSON.stringify({
      claim: this.claim,
      rootHash: this.rootHash,
      attestedClaimHash: this.attestedClaimHash,
      attestedClaimSignature: this.attestedClaimSignature,
      attesterAddress: this.attesterAddress,
      attesterSignature: this.attesterSignature,
      claimerAddress: this.claimerAddress,
      claimerSignature: this.claimerSignature,
      claimTypeHash: this.claimTypeHash,
      claimHashTree: this.claimHashTree,
      id: this.id,
      level: this.level,
      transaction: this.transaction?.serialize(),
      valid: this.valid,
      status: this.status,
    });
  }

  public static parse(str: string): ICredential {
    const {
      claim,
      rootHash,
      attestedClaimHash,
      attestedClaimSignature,
      attesterAddress,
      attesterSignature,
      claimerAddress,
      claimerSignature,
      claimTypeHash,
      claimHashTree,
      id,
      level,
      transaction,
      valid,
      status,
    } = JSON.parse(str);

    const attestedCLaim = new SDKAttestedClaim({
      claim,
      rootHash,
      attestedClaimHash,
      attestedClaimSignature,
      attesterAddress,
      attesterSignature,
      claimerAddress,
      claimerSignature,
      claimTypeHash,
      claimHashTree,
    });

    let transactionInstance;

    if (transaction) {
      transactionInstance = TransactionDetails.parse(transaction);
    }

    return new Credential(
      attestedCLaim,
      id,
      level,
      status,
      transactionInstance,
      valid,
    );
  }
}
