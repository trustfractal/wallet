import { AttestationRequest, Credential } from "@fractalwallet/sdk";
import { IAttestationRequest } from "@fractalwallet/sdk/src/types";

import wallet from "../wallet";

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

const buildRequest = (json: IAttestationRequest): AttestationRequest | null => {
  if (!validRequestJson(json)) return null;

  const request = new AttestationRequest(json);

  return request.validate() ? request : null;
};

const addSignature = async (credential: Credential) => {
  const attesterSignature = await wallet.signMessage(credential.rootHash);

  credential.attesterAddress = wallet.address;
  credential.attesterSignature = attesterSignature;
};

const perform = async (
  requestJson: IAttestationRequest
): Promise<Credential | null> => {
  const request = buildRequest(requestJson);
  if (!request) return null;

  const credential = Credential.fromRequest(request);
  await addSignature(credential);

  if (!credential.verifyIntegrity()) return null;

  return credential;
};

export default { perform };
