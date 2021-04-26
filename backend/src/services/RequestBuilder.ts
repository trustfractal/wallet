import { IAttestationRequest } from "@fractalwallet/sdk/src/types";
import { AttestationRequest } from "@fractalwallet/sdk";

const validRequestJson = ({
  claim,
  claimerSignature,
  claimHashTree,
  claimTypeHash,
  rootHash,
}: IAttestationRequest) =>
  !!claim &&
  !!claimerSignature &&
  !!claimHashTree &&
  !!claimTypeHash &&
  !!rootHash;

const perform = (json: IAttestationRequest): AttestationRequest | null => {
  if (!validRequestJson(json)) return null;

  const request = new AttestationRequest(json);

  return request.validate() ? request : null;
};

export default { perform };
