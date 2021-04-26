import { AttestationRequest, Credential } from "@fractalwallet/sdk";
import wallet from "../wallet";

const addSignature = async (credential: Credential) => {
  const attesterSignature = await wallet.signMessage(credential.rootHash);

  credential.attesterAddress = wallet.address;
  credential.attesterSignature = attesterSignature;
};

const perform = async (
  request: AttestationRequest
): Promise<Credential | null> => {
  const credential = Credential.fromRequest(request);
  await addSignature(credential);

  if (!credential.verifyIntegrity()) return null;

  return credential;
};

export default { perform };
