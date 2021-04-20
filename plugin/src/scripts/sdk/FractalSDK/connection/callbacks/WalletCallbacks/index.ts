import EthereumProviderService from "@services/EthereumProviderService";

import ConnectionTypes from "@models/Connection/types";

export const commitCredential = async ([credential]: any[]) =>
  EthereumProviderService.commitCredential(credential);

export const getAccountAddress = () =>
  EthereumProviderService.getAccountAddress();

const Callbacks = {
  [ConnectionTypes.COMMIT_CREDENTIAL]: { callback: commitCredential },
  [ConnectionTypes.GET_ACCOUNT_ADDRESS]: { callback: getAccountAddress },
};

export default Callbacks;
