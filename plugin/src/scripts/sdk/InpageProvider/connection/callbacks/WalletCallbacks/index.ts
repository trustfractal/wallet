import EthereumProviderService from "@services/EthereumProviderService";

import ConnectionTypes from "@models/Connection/types";
import TokenTypes from "@models/Token/types";

export const getAccountAddress = () =>
  EthereumProviderService.getAccountAddress();

export const getStakingDetails = ([address, token]: [string, TokenTypes]) =>
  EthereumProviderService.getStakingDetails(address, token);

export const approveStake = ([address, amount, token]: [
  string,
  string,
  TokenTypes,
]) => EthereumProviderService.approveStake(address, amount, token);

export const stake = ([address, amount, token, serializedCredential]: [
  string,
  string,
  TokenTypes,
  string,
]) =>
  EthereumProviderService.stake(address, amount, token, serializedCredential);

export const getAllowedAmount = ([address, token]: [string, TokenTypes]) =>
  EthereumProviderService.getAllowedAmount(address, token);

export const withdraw = ([address, token]: [string, TokenTypes]) =>
  EthereumProviderService.withdraw(address, token);

const Callbacks = {
  [ConnectionTypes.GET_ACCOUNT_ADDRESS_INPAGE]: { callback: getAccountAddress },
  [ConnectionTypes.GET_ALLOWED_AMOUNT_INPAGE]: { callback: getAllowedAmount },
  [ConnectionTypes.GET_STAKING_DETAILS_INPAGE]: { callback: getStakingDetails },
  [ConnectionTypes.APPROVE_STAKE_INPAGE]: { callback: approveStake },
  [ConnectionTypes.STAKE_INPAGE]: { callback: stake },
  [ConnectionTypes.WITHDRAW_INPAGE]: { callback: withdraw },
};

export default Callbacks;
