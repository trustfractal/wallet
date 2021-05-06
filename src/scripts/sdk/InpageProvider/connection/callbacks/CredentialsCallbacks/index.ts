import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService/Web3ProviderService";

export const credentialStore = ([
  address,
  serializedCredential,
  claimsRegistryContractAddress,
]: [string, string, string]) =>
  EthereumProviderService.credentialStore(
    address,
    serializedCredential,
    claimsRegistryContractAddress,
  );

export const getAttestationRequest = ([address, level, serializedProperties]: [
  string,
  string,
  string,
]) =>
  EthereumProviderService.getAttestationRequest(
    address,
    level,
    serializedProperties,
  );

export const isCredentialValid = ([
  address,
  serializedCredential,
  claimsRegistryAddress,
]: [string, string, string]) =>
  EthereumProviderService.isCredentialValid(
    address,
    serializedCredential,
    claimsRegistryAddress,
  );

const Callbacks = {
  [ConnectionTypes.CREDENTIAL_STORE_INPAGE]: { callback: credentialStore },
  [ConnectionTypes.GET_ATTESTATION_REQUEST_INPAGE]: {
    callback: getAttestationRequest,
  },
  [ConnectionTypes.IS_CREDENTIAL_VALID_INPAGE]: { callback: isCredentialValid },
};

export default Callbacks;
