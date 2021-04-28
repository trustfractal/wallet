import {
  AttestationRequest,
  DIDContract,
  Credential,
} from "@fractalwallet/sdk";

import wallet from "../wallet";
import { getEnv } from "../utils";

const ETHEREUM_RPC_URL = getEnv("ETHEREUM_RPC_URL");
const ETHEREUM_NETWORK = getEnv("ETHEREUM_NETWORK");

const addContractSignature = async (credential: Credential) => {
  console.log(ETHEREUM_RPC_URL);
  const contract = new DIDContract(ETHEREUM_NETWORK, {
    providerUrl: ETHEREUM_RPC_URL,
  });

  const credentialHash = await contract.computeSignableKey(credential);
  const credentialSignature = await wallet.signMessage(credentialHash);

  credential.credentialHash = credentialHash;
  credential.credentialSignature = credentialSignature;
};

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

  await addContractSignature(credential);

  return credential;
};

export default { perform };
