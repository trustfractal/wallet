import EthereumProviderService from "@services/EthereumProviderService";

import ConnectionTypes from "@models/Connection/types";
import TokenTypes from "@models/Token/types";

export const getAccountAddress = () =>
  EthereumProviderService.getAccountAddress();

export const stake = ([address, amount, token, serializedCredential]: [
  string,
  string,
  TokenTypes,
  string,
]) =>
  EthereumProviderService.stake(address, amount, token, serializedCredential);

export const withdraw = ([address, token]: [string, TokenTypes]) =>
  EthereumProviderService.withdraw(address, token);

const Callbacks = {
  [ConnectionTypes.GET_ACCOUNT_ADDRESS_INPAGE]: { callback: getAccountAddress },
  [ConnectionTypes.STAKE_INPAGE]: { callback: stake },
  [ConnectionTypes.WITHDRAW_INPAGE]: { callback: withdraw },
};

export default Callbacks;
