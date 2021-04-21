import EthereumProviderService from "@services/EthereumProviderService";

import ConnectionTypes from "@models/Connection/types";

export const getAccountAddress = () =>
  EthereumProviderService.getAccountAddress();

const Callbacks = {
  [ConnectionTypes.GET_ACCOUNT_ADDRESS]: { callback: getAccountAddress },
};

export default Callbacks;
