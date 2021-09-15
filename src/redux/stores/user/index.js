import { createStore, combineReducers, applyMiddleware } from "redux";
import { Store, alias, wrapStore } from "webext-redux";
import thunk from "redux-thunk";

import StorageService from "@services/StorageService";
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
  protocolRegistrationTypes,
  reducer as protocolReducer,
  restore as protocolRestore,
  store as protocolStore,
} from "@redux/stores/user/reducers/protocol";

import {
  ERROR_DECRYPT_FAILED,
  ERROR_LOCAL_STATE_NOT_FOUND,
  ERROR_SALT_NOT_FOUND,
  ERROR_STORE_NOT_INITIALIZED,
} from "./Errors";

import appActions from "@redux/stores/application/reducers/app";
import { MIGRATIONS } from "@redux/stores/application/reducers/metadata";
import { getLastMigration } from "@redux/stores/application/reducers/metadata/selectors";

const runDataMigrations = (userStore) => {
  const lastMigration = getLastMigration(AppStore.getStore().getState());

  // Check if has to run version 0.3.7 data migration
  if (lastMigration < MIGRATIONS["0.3.7"]) {
    // Check if protocol state is completed
    const registrationState = getRegistrationState(store.getState());

    if (
      registrationState === protocolRegistrationTypes.IDENTITY_REGISTERED ||
      registrationState === protocolRegistrationTypes.MINTING_REGISTERED ||
      registrationState === protocolRegistrationTypes.COMPLETED
    ) {
      AppStore.getStore().dispatch(appActions.setWalletGenerated(true));
    }

    // Update last migration value
    AppStore.getStore().dispatch(
      metadataActions.setLastMigration(MIGRATIONS["0.3.7"]),
    );
  }
};

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

    this._runDataMigrations();

    return this.storeInternal;
  }

  _runDataMigrations() {
    // When the extension updates, we want to run data migrations.
    // Some of these may only run when the encrypted user store is
    // initialiased.

    runDataMigrations(this.storeInternal);
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
    };
  }

  static async serialize(state) {
    return JSON.stringify({
      credentials: await credentialsStore(state.credentials),
      requests: await requestsStore(state.requests),
      protocol: await protocolStore(state.protocol),
    });
  }

  static async clearStorage() {
    await UserStore.setStoredSalt(null);
  }

  static reset() {
    return UserStore.clearStorage();
  }
}

export const store = UserStore.getInstance();

export default store;
