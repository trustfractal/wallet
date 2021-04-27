import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService";

export const credentialStore = ([address, serializedCredential]: [
  string,
  string,
]) => EthereumProviderService.credentialStore(address, serializedCredential);

export const getAttestationRequest = ([
  address,
  credentialId,
  serializedProperties,
]: [string, string, string]) =>
  EthereumProviderService.getAttestationRequest(
    address,
    credentialId,
    serializedProperties,
  );

export const isCredentialValid = ([address, serializedCredential]: [
  string,
  string,
]) => EthereumProviderService.isCredentialValid(address, serializedCredential);

const Callbacks = {
  [ConnectionTypes.CREDENTIAL_STORE_INPAGE]: { callback: credentialStore },
  [ConnectionTypes.GET_ATTESTATION_REQUEST_INPAGE]: {
    callback: getAttestationRequest,
  },
  [ConnectionTypes.IS_CREDENTIAL_VALID_INPAGE]: { callback: isCredentialValid },
};

export default Callbacks;
