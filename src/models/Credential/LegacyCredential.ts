import { AttestedClaim as SDKAttestedClaim } from "@trustfractal/sdk";
import {
  ILegacyCredential,
  ITransactionDetails,
  ISerializable,
} from "@pluginTypes/index";

import TransactionDetails from "@models/Transaction/TransactionDetails";

import CredentialsStatus from "./status";
import CredentialsVersions from "./versions";
import Credential from "@models/Credential";

export default class LegacyCredential
  extends Credential
  implements ILegacyCredential, ISerializable {
  public status: CredentialsStatus;
  public transaction?: ITransactionDetails;
  public valid: boolean;

  public constructor(
    credential: SDKAttestedClaim,
    id: string,
    level: string,
    status?: CredentialsStatus,
    transaction?: ITransactionDetails,
    valid: boolean = false,
    version: string = CredentialsVersions.VERSION_ONE,
  ) {
    super(credential, id, level, version);
    this.transaction = transaction;
    this.valid = valid;

    if (status !== undefined) {
      this.status = status;
    } else {
      if (this.valid) {
        this.status = CredentialsStatus.VALID;
      } else {
        this.status = CredentialsStatus.INVALID;
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
      version: this.version,
    });
  }

  public static parse(str: string): ILegacyCredential {
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
      version,
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

    return new LegacyCredential(
      attestedCLaim,
      id,
      level,
      status,
      transactionInstance,
      valid,
      version,
    );
  }
}
