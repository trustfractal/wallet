import { createStore, combineReducers, applyMiddleware } from "redux";
import { alias, wrapStore } from "webext-redux";
import thunk from "redux-thunk";

import watcher from "@redux/middleware/watcher";

import StorageService from "@services/StorageService";
import CryptoUtils from "@utils/CryptoUtils";

import aliases from "@background/aliases";

import {
  reducer as appReducer,
  restore as appRestore,
  store as appStore,
} from "@redux/app";
import {
  reducer as requestsReducer,
  restore as requestsRestore,
  store as requestsStore,
} from "@redux/requests";
import {
  reducer as credentialsReducer,
  restore as credentialsRestore,
  store as credentialsStore,
} from "@redux/credentials";

class Store {
  static instance = undefined;

  static STATE_ALIAS = "redux-state";
  static SALT_ALIAS = "redux-state-salt";

  constructor() {
    this.storeInternal = undefined;
  }

  get store() {
    return this.storeInternal;
  }

  static getInstance() {
    if (Store.instance === undefined) {
      Store.instance = new Store();
    }

    return Store.instance;
  }

  async init(password = "supersecretpassword") {
    const storedState = await Store.getStoredState();
    if (!storedState) {
      await Store.createSalt();
      await Store.createState(password);
    }

    const persistedState = await Store.decryptAndDeserialize(password);

    this.storeInternal = createStore(
      Store.getCombinedReducers(),
      persistedState,
      Store.getMiddleware(),
    );

    const hashedPassword = await Store.getHashedPassword(password);
    this.storeInternal.subscribe(() => {
      Store.serializeEncryptAndStore(
        this.storeInternal.getState(),
        hashedPassword,
      );
    });

    wrapStore(this.storeInternal);

    return this.storeInternal;
  }

  static getCombinedReducers() {
    return combineReducers({
      app: appReducer,
      credentials: credentialsReducer,
      requests: requestsReducer,
    });
  }

  static getMiddleware() {
    return applyMiddleware(watcher, alias(aliases), thunk);
  }

  static async createSalt() {
    const salt = CryptoUtils.getRandomBytes();
    await Store.setStoredSalt(salt);
  }

  static async createState(password) {
    const hashedPassword = await Store.getHashedPassword(password);
    const state = await Store.deserialize("{}");
    await Store.serializeEncryptAndStore(state, hashedPassword);
  }

  static getStoredSalt() {
    return StorageService.getItem(Store.SALT_ALIAS);
  }

  static setStoredSalt(alias) {
    return StorageService.setItem(Store.SALT_ALIAS, alias);
  }

  static getStoredState() {
    return StorageService.getItem(Store.STATE_ALIAS);
  }

  static setStoredState(state) {
    return StorageService.setItem(Store.STATE_ALIAS, state);
  }

  static async getHashedPassword(password) {
    const salt = await Store.getStoredSalt();
    if (!salt) throw new Error("No password salt found");

    return CryptoUtils.passwordHashing(password, salt);
  }

  static async decrypt(password) {
    const localState = await Store.getStoredState();

    const hashedPassword = await Store.getHashedPassword(password);
    if (!localState) throw new Error("LocalState not found");

    return CryptoUtils.decryption(localState, hashedPassword);
  }

  static async decryptAndDeserialize(password) {
    const decryptedState = await Store.decrypt(password);
    if (!decryptedState) throw new Error("Store could not be decrypted");
    const persistedState = await Store.deserialize(decryptedState);

    return persistedState;
  }

  static async serializeEncryptAndStore(state, hashedPassword) {
    const serializedState = await Store.serialize(state);
    const encryptedState = CryptoUtils.encryption(
      serializedState,
      hashedPassword,
    );
    await Store.setStoredState(JSON.stringify(encryptedState));
  }

  static async deserialize(state) {
    const deserializedState = JSON.parse(state);

    return {
      app: await appRestore(deserializedState.app),
      credentials: await credentialsRestore(
        deserializedState.credentialsReducer,
      ),
      requests: await requestsRestore(deserializedState.requests),
    };
  }

  static async serialize(state) {
    return JSON.stringify({
      app: await appStore(state.app),
      credentials: await credentialsStore(state.credentials),
      requests: await requestsStore(state.requests),
    });
  }

  static async clearStorage() {
    await Store.setStoredSalt();
    await Store.setStoredState();
  }

  static reset() {
    return Store.clearStorage();
  }
}

const store = Store.getInstance();

export default store;
