import EthereumProviderService from "@services/EthereumProviderService";

import ConnectionTypes from "@models/Connection/types";

export const getAccountAddress = () =>
  EthereumProviderService.getAccountAddress();

export const getStakingDetails = ([
  address,
  tokenContractAddress,
  stakingTokenContractAddress,
]: [string, string, string]) =>
  EthereumProviderService.getStakingDetails(
    address,
    tokenContractAddress,
    stakingTokenContractAddress,
  );

export const approveStake = ([
  address,
  amount,
  tokenContractAddress,
  stakingTokenContractAddress,
]: [string, string, string, string, string]) =>
  EthereumProviderService.approveStake(
    address,
    amount,
    tokenContractAddress,
    stakingTokenContractAddress,
  );

export const stake = ([
  address,
  amount,
  serializedCredential,
  tokenContractAddress,
  stakingTokenContractAddress,
]: [string, string, string, string, string]) =>
  EthereumProviderService.stake(
    address,
    amount,
    serializedCredential,
    tokenContractAddress,
    stakingTokenContractAddress,
  );

export const getAllowedAmount = ([
  address,
  tokenContractAddress,
  stakingTokenContractAddress,
]: [string, string, string]) =>
  EthereumProviderService.getAllowedAmount(
    address,
    tokenContractAddress,
    stakingTokenContractAddress,
  );

export const withdraw = ([address, stakingTokenContractAddress]: [
  string,
  string,
]) => EthereumProviderService.withdraw(address, stakingTokenContractAddress);

const Callbacks = {
  [ConnectionTypes.GET_ACCOUNT_ADDRESS_INPAGE]: { callback: getAccountAddress },
  [ConnectionTypes.GET_ALLOWED_AMOUNT_INPAGE]: { callback: getAllowedAmount },
  [ConnectionTypes.GET_STAKING_DETAILS_INPAGE]: { callback: getStakingDetails },
  [ConnectionTypes.APPROVE_STAKE_INPAGE]: { callback: approveStake },
  [ConnectionTypes.STAKE_INPAGE]: { callback: stake },
  [ConnectionTypes.WITHDRAW_INPAGE]: { callback: withdraw },
};

export default Callbacks;
