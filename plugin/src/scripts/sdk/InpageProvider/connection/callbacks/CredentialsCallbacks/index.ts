import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService";

export const credentialStore = ([address, serializedCredential]: [
  string,
  string,
]) => EthereumProviderService.credentialStore(address, serializedCredential);

export const isCredentialValid = ([address, serializedCredential]: [
  string,
  string,
]) => EthereumProviderService.isCredentialValid(address, serializedCredential);

const Callbacks = {
  [ConnectionTypes.CREDENTIAL_STORE_INPAGE]: { callback: credentialStore },
  [ConnectionTypes.IS_CREDENTIAL_VALID_INPAGE]: { callback: isCredentialValid },
};

export default Callbacks;
