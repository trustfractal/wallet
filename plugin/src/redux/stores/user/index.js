import { createStore, combineReducers, applyMiddleware } from "redux";
import { Store, alias, wrapStore } from "webext-redux";
import thunk from "redux-thunk";

import watcher from "@redux/middleware/watcher";

import StorageService from "@services/StorageService";
import CryptoUtils from "@utils/CryptoUtils";

import aliases from "@redux/stores/user/aliases";

import {
  reducer as credentialsReducer,
  restore as credentialsRestore,
  store as credentialsStore,
} from "@redux/stores/user/reducers/credentials";
import {
  reducer as requestsReducer,
  restore as requestsRestore,
  store as requestsStore,
} from "@redux/stores/user/reducers/requests";
import {
  reducer as walletReducer,
  restore as walletRestore,
  store as walletStore,
} from "@redux/stores/user/reducers/wallet";

export class UserStore {
  static instance = undefined;

  static STATE_ALIAS = "user-state";
  static SALT_ALIAS = "user-state-salt";
  static PORT_NAME = "user-state-port";

  constructor() {
    this.storeInternal = undefined;
  }

  getStore() {
    if (!this.storeInternal) {
      throw new Error(
        "UserStore: store not initialized, please call init before trying to access the store",
      );
    }

    return this.storeInternal;
  }

  static getInstance() {
    if (UserStore.instance === undefined) {
      UserStore.instance = new UserStore();
    }

    return UserStore.instance;
  }

  async init(password) {
    const storedState = await UserStore.getStoredState();
    if (!storedState) {
      await UserStore.createSalt();
      await UserStore.createState(password);
    }

    const persistedState = await UserStore.decryptAndDeserialize(password);

    this.storeInternal = createStore(
      UserStore.getCombinedReducers(),
      persistedState,
      UserStore.getMiddleware(),
    );

    const hashedPassword = await UserStore.getHashedPassword(password);
    this.storeInternal.subscribe(() => {
      UserStore.serializeEncryptAndStore(
        this.storeInternal.getState(),
        hashedPassword,
      );
    });

    wrapStore(this.storeInternal, {
      portName: UserStore.PORT_NAME,
    });

    return this.storeInternal;
  }

  static connect() {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        let store = new Store({ portName: UserStore.PORT_NAME });
        await store.ready();
        clearInterval(interval);
        resolve(store);
      }, 100);
    });
  }

  static getCombinedReducers() {
    return combineReducers({
      credentials: credentialsReducer,
      requests: requestsReducer,
      wallet: walletReducer,
    });
  }

  static getMiddleware() {
    return applyMiddleware(watcher, alias(aliases), thunk);
  }

  static async createSalt() {
    const salt = CryptoUtils.getRandomBytes();
    await UserStore.setStoredSalt(salt);
  }

  static async createState(password) {
    const hashedPassword = await UserStore.getHashedPassword(password);
    const state = await UserStore.deserialize("{}");
    await UserStore.serializeEncryptAndStore(state, hashedPassword);
  }

  static getStoredSalt() {
    return StorageService.getItem(UserStore.SALT_ALIAS);
  }

  static setStoredSalt(alias) {
    return StorageService.setItem(UserStore.SALT_ALIAS, alias);
  }

  static getStoredState() {
    return StorageService.getItem(UserStore.STATE_ALIAS);
  }

  static setStoredState(state) {
    return StorageService.setItem(UserStore.STATE_ALIAS, state);
  }

  static async getHashedPassword(password) {
    const salt = await UserStore.getStoredSalt();
    if (!salt) throw new Error("No password salt found");

    return CryptoUtils.passwordHashing(password, salt);
  }

  static async decrypt(password) {
    const localState = await UserStore.getStoredState();

    const hashedPassword = await UserStore.getHashedPassword(password);
    if (!localState) throw new Error("LocalState not found");

    return CryptoUtils.decryption(localState, hashedPassword);
  }

  static async decryptAndDeserialize(password) {
    const decryptedState = await UserStore.decrypt(password);
    if (!decryptedState) throw new Error("Store could not be decrypted");
    const persistedState = await UserStore.deserialize(decryptedState);

    return persistedState;
  }

  static async serializeEncryptAndStore(state, hashedPassword) {
    const serializedState = await UserStore.serialize(state);
    const encryptedState = CryptoUtils.encryption(
      serializedState,
      hashedPassword,
    );
    await UserStore.setStoredState(JSON.stringify(encryptedState));
  }

  static async deserialize(state) {
    const deserializedState = JSON.parse(state);

    return {
      credentials: await credentialsRestore(
        deserializedState.credentialsReducer,
      ),
      requests: await requestsRestore(deserializedState.requests),
      wallet: await walletRestore(deserializedState.wallet),
    };
  }

  static async serialize(state) {
    return JSON.stringify({
      credentials: await credentialsStore(state.credentials),
      requests: await requestsStore(state.requests),
      wallet: await walletStore(state.wallet),
    });
  }

  static async clearStorage() {
    await UserStore.setStoredSalt(null);
    await UserStore.setStoredState(null);
  }

  static reset() {
    return UserStore.clearStorage();
  }
}

export const store = UserStore.getInstance();

export default store;
