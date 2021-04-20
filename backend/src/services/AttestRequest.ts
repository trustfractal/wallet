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

const buildRequest = (json: IAttestationRequest): AttestationRequest => {
  if (!validRequestJson(json)) return null;

  const request = new AttestationRequest(json);

  return request.validate() ? request : null;
};

const addSignature = (credential: Credential) => {
  const attesterSignature = await wallet.signMessage(credential.rootHash);

  credential.attesterAddress = wallet.address;
  credential.attesterSignature = attesterSignature;
};

const AttestRequest = (requestJson: IAttestationRequest): Credential => {
  const request = buildRequest(requestJson);
  if (!request) return null;

  const credential = Credential.fromRequest(request);
  addSignature(credential);

  if (!credential.verifyIntegrity()) return null;

  return credential;
};

export default AttestRequest;
