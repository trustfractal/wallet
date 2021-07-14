import EthereumProviderService from "@services/EthereumProviderService/Web3ProviderService";

import ConnectionTypes from "@models/Connection/types";

const CATFISH_SESSION_KEY = "catfish_token";
const MEGALODON_SESSION_KEY = "megalodon_token";

export const getBackendSessions = () => ({
  catfish: localStorage.getItem(CATFISH_SESSION_KEY),
  megalodon: localStorage.getItem(MEGALODON_SESSION_KEY),
  scopes: localStorage.getItem(`${MEGALODON_SESSION_KEY}-scopes`),
});

export const getMegalodonSession = () =>
  localStorage.getItem(MEGALODON_SESSION_KEY);

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

export const getSignedNonce = ([nonce, address]: [string, string]) =>
  EthereumProviderService.getSignedNonce(nonce, address);

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

export const withdraw = ([address, stakingTokenContractAddress]: [
  string,
  string,
]) => EthereumProviderService.withdraw(address, stakingTokenContractAddress);

const Callbacks = {
  [ConnectionTypes.GET_BACKEND_SESSIONS_INPAGE]: {
    callback: getBackendSessions,
  },
  [ConnectionTypes.GET_ACCOUNT_ADDRESS_INPAGE]: { callback: getAccountAddress },
  [ConnectionTypes.GET_STAKING_DETAILS_INPAGE]: { callback: getStakingDetails },
  [ConnectionTypes.GET_SIGNED_NONCE_INPAGE]: { callback: getSignedNonce },
  [ConnectionTypes.APPROVE_STAKE_INPAGE]: { callback: approveStake },
  [ConnectionTypes.STAKE_INPAGE]: { callback: stake },
  [ConnectionTypes.WITHDRAW_INPAGE]: { callback: withdraw },
};

export default Callbacks;
