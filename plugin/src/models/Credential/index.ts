import {
  ICredential,
  ITransactionDetails,
  ISerializable,
} from "@fractalwallet/types";

import { Credential as SDKCredential } from "@fractalwallet/sdk";
import TransactionDetails from "@models/Transaction/TransactionDetails";

export default class Credential
  extends SDKCredential
  implements ICredential, ISerializable {
  public level: string;
  public transaction?: ITransactionDetails;
  public valid: boolean;

  public constructor(
    credential: SDKCredential,
    level: string,
    transaction?: ITransactionDetails,
    valid: boolean = false,
  ) {
    super({
      claim: credential.claim,
      rootHash: credential.rootHash,
      credentialHash: credential.credentialHash,
      credentialSignature: credential.credentialSignature,
      attesterAddress: credential.attesterAddress,
      attesterSignature: credential.attesterSignature,
      claimerAddress: credential.claimerAddress,
      claimerSignature: credential.claimerSignature,
      claimTypeHash: credential.claimTypeHash,
      claimHashTree: credential.claimHashTree,
    });
    this.level = level;
    this.transaction = transaction;
    this.valid = valid;
  }

  public serialize(): string {
    return JSON.stringify({
      claim: this.claim,
      rootHash: this.rootHash,
      credentialHash: this.credentialHash,
      credentialSignature: this.credentialSignature,
      attesterAddress: this.attesterAddress,
      attesterSignature: this.attesterSignature,
      claimerAddress: this.claimerAddress,
      claimerSignature: this.claimerSignature,
      claimTypeHash: this.claimTypeHash,
      claimHashTree: this.claimHashTree,
      level: this.level,
      transaction: this.transaction?.serialize(),
      valid: this.valid,
    });
  }

  public static parse(str: string): ICredential {
    const {
      claim,
      rootHash,
      credentialHash,
      credentialSignature,
      attesterAddress,
      attesterSignature,
      claimerAddress,
      claimerSignature,
      claimTypeHash,
      claimHashTree,
      level,
      transaction,
      valid,
    } = JSON.parse(str);

    const sdkCredential = new SDKCredential({
      claim,
      rootHash,
      credentialHash,
      credentialSignature,
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

    return new Credential(sdkCredential, level, transactionInstance, valid);
  }
}
