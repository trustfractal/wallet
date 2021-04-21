import EthereumProviderService from "@services/EthereumProviderService";

import ConnectionTypes from "@models/Connection/types";

export const getAccountAddress = () =>
  EthereumProviderService.getAccountAddress();

export const stake = ([address, amount]: [string, number]) =>
  EthereumProviderService.stake(address, amount);

export const withdraw = ([address]: [string]) =>
  EthereumProviderService.withdraw(address);

const Callbacks = {
  [ConnectionTypes.GET_ACCOUNT_ADDRESS]: { callback: getAccountAddress },
  [ConnectionTypes.STAKE_COMMIT]: { callback: stake },
  [ConnectionTypes.WITHDRAW_COMMIT]: { callback: withdraw },
};

export default Callbacks;
