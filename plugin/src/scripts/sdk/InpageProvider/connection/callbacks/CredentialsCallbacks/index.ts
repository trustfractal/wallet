import ConnectionTypes from "@models/Connection/types";
import EthereumProviderService from "@services/EthereumProviderService";

export const credentialStore = ([address, serializedCredential]: [
  string,
  string,
]) => EthereumProviderService.credentialStore(address, serializedCredential);

const Callbacks = {
  [ConnectionTypes.CREDENTIAL_STORE_COMMIT]: { callback: credentialStore },
};

export default Callbacks;
