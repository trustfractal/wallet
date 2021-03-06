import { createStore, combineReducers, applyMiddleware } from "redux";
import { Store, alias, wrapStore } from "webext-redux";
import thunk from "redux-thunk";

import { getStorageService } from "@services/Factory";
import CryptoUtils from "@utils/CryptoUtils";

import aliases from "@redux/stores/user/aliases";
import watchers from "@redux/middlewares/watchers";

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
  reducer as protocolReducer,
  restore as protocolRestore,
  store as protocolStore,
} from "@redux/stores/user/reducers/protocol";

import {
  reducer as profileReducer,
  restore as profileRestore,
  store as profileStore,
} from "@redux/stores/user/reducers/profile";

import {
  ERROR_DECRYPT_FAILED,
  ERROR_LOCAL_STATE_NOT_FOUND,
  ERROR_SALT_NOT_FOUND,
  ERROR_STORE_NOT_INITIALIZED,
} from "./Errors";

export class UserStore {
  static instance = undefined;

  static STATE_ALIAS = "user-state";
  static SALT_ALIAS = "user-state-salt";
  static PORT_NAME = "user-state-port";

  constructor() {
    this.storeInternal = undefined;
  }

  getStore() {
    if (!this.storeInternal) throw ERROR_STORE_NOT_INITIALIZED();

    return this.storeInternal;
  }

  static getInstance() {
    if (UserStore.instance === undefined) {
      UserStore.instance = new UserStore();
    }

    return UserStore.instance;
  }

  async isInitialized() {
    return this.storeInternal !== undefined;
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

  static async connect() {
    let store = new Store({ portName: UserStore.PORT_NAME });
    await store.ready();
    return store;
  }

  static getCombinedReducers() {
    return combineReducers({
      credentials: credentialsReducer,
      requests: requestsReducer,
      protocol: protocolReducer,
      profile: profileReducer,
    });
  }

  static getMiddleware() {
    return applyMiddleware(watchers, alias(aliases), thunk);
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
    return getStorageService().getItem(UserStore.SALT_ALIAS);
  }

  static setStoredSalt(alias) {
    return getStorageService().setItem(UserStore.SALT_ALIAS, alias);
  }

  static getStoredState() {
    return getStorageService().getItem(UserStore.STATE_ALIAS);
  }

  static setStoredState(state) {
    return getStorageService().setItem(UserStore.STATE_ALIAS, state);
  }

  static async getHashedPassword(password) {
    const salt = await UserStore.getStoredSalt();
    if (!salt) throw ERROR_SALT_NOT_FOUND();

    return CryptoUtils.passwordHashing(password, salt);
  }

  static async decrypt(password) {
    const localState = await UserStore.getStoredState();

    const hashedPassword = await UserStore.getHashedPassword(password);
    if (!localState) throw ERROR_LOCAL_STATE_NOT_FOUND();

    return CryptoUtils.decryption(localState, hashedPassword);
  }

  static async decryptAndDeserialize(password) {
    const decryptedState = await UserStore.decrypt(password);
    if (!decryptedState) throw ERROR_DECRYPT_FAILED();
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
      credentials: await credentialsRestore(deserializedState.credentials),
      requests: await requestsRestore(deserializedState.requests),
      protocol: await protocolRestore(deserializedState.protocol),
      profile: await profileRestore(deserializedState.profile),
    };
  }

  static async serialize(state) {
    return JSON.stringify({
      credentials: await credentialsStore(state.credentials),
      requests: await requestsStore(state.requests),
      protocol: await protocolStore(state.protocol),
      profile: await profileStore(state.profile),
    });
  }

  static async clearStorage() {
    await UserStore.setStoredSalt(null);
  }

  static reset() {
    return UserStore.clearStorage();
  }
}

const store = UserStore.getInstance();

export default store;
