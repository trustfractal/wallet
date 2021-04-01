/* global chrome */

import kiltActions, { kiltTypes } from "@redux/kilt";
import { getCredentials } from "@redux/selectors";

import Mnemonic from "@models/Mnemonic";
import Credential from "@models/Credential";
import CredentialStatus from "@models/Credential/CredentialStatus";

import KiltService from "@services/kilt";

const generateIdentity = () => {
  return async (dispatch) => {
    const { mnemonic, identity } = await KiltService.generateIdentity();

    // create mnemonic class instance
    const instance = new Mnemonic(mnemonic, identity);

    // register balance listener
    const onChangeBalance = (_account, balance) =>
      dispatch(kiltActions.setBalance(balance.toString()));

    await KiltService.registerBalanceListener(
      instance.identity,
      onChangeBalance,
    );

    // update redux store
    dispatch(kiltActions.setMnemonic(instance));
  };
};

export const createCredential = () => {
  return async () => {
    // open attester url
    chrome.tabs.create({ url: process.env.REACT_APP_ATTESTER_URL });
  };
};

export const addCredential = ({
  payload: {
    id,
    attester,
    claimer,
    properties,
    ctype,
    claim,
    status,
    createdAt,
  },
}) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // create credential instance
    const credential = new Credential(
      id,
      attester,
      claimer,
      properties,
      ctype,
      claim,
      status,
      createdAt,
    );

    // append credential
    credentials.push(credential);

    // update redux store
    dispatch(kiltActions.setCredentials(credentials));
  };
};

export const verifyCredential = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    const credential = credentials.getById(id);

    const isCredentialOnChain = await KiltService.verifyCredential(credential);
    console.log("isCredentialOnChain", isCredentialOnChain);

    if (isCredentialOnChain) {
      credential.status = CredentialStatus.VERIFIED;
    } else {
      credential.status = CredentialStatus.UNVERIFIED;
    }

    // update credentials
    credentials.updateItem(id, credential);

    // update redux store
    dispatch(kiltActions.setCredentials(credentials));
  };
};

export const removeCredential = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // get request
    const credential = credentials.getById(id);

    // remove credential
    credentials.removeById(credential.id);

    // update redux store
    dispatch(kiltActions.setCredentials(credentials));
  };
};

const Aliases = {
  [kiltTypes.GENERATE_IDENTITY]: generateIdentity,
  [kiltTypes.CREATE_CREDENTIAL]: createCredential,
  [kiltTypes.ADD_CREDENTIAL]: addCredential,
  [kiltTypes.VERIFY_CREDENTIAL]: verifyCredential,
  [kiltTypes.REMOVE_CREDENTIAL]: removeCredential,
};

export default Aliases;
