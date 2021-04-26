import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService";

export const credentialStore = ([address, serializedCredential]: [
  string,
  string,
]) => EthereumProviderService.credentialStore(address, serializedCredential);

export const generateSignedCredential = ([
  address,
  credentialId,
  serializedProperties,
  serializedPseudoSchema,
]: [string, string, string, string]) =>
  EthereumProviderService.generateSignedCredential(
    address,
    credentialId,
    serializedProperties,
    serializedPseudoSchema,
  );

export const isCredentialValid = ([address, serializedCredential]: [
  string,
  string,
]) => EthereumProviderService.isCredentialValid(address, serializedCredential);

const Callbacks = {
  [ConnectionTypes.CREDENTIAL_STORE_INPAGE]: { callback: credentialStore },
  [ConnectionTypes.GENERATE_SIGNED_CREDENTIAL_INPAGE]: {
    callback: generateSignedCredential,
  },
  [ConnectionTypes.IS_CREDENTIAL_VALID_INPAGE]: { callback: isCredentialValid },
};

export default Callbacks;
