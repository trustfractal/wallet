import { createStore, combineReducers, applyMiddleware } from "redux";
import { Store, alias, wrapStore } from "webext-redux";
import thunk from "redux-thunk";

import watcher from "@redux/middleware/watcher";

import StorageService from "@services/StorageService";

import aliases from "@background/aliases";

import {
  reducer as appReducer,
  restore as appRestore,
  store as appStore,
} from "@redux/stores/application/reducers/app";
import {
  reducer as authReducer,
  restore as authRestore,
  store as authStore,
} from "@redux/stores/application/reducers/auth";
import { reducer as registerReducer } from "@redux/stores/application/reducers/register";

export class AppStore {
  static instance = undefined;

  static STATE_ALIAS = "app-state";
  static PORT_NAME = "app-state-port";

  constructor() {
    this.storeInternal = undefined;
  }

  get store() {
    return this.storeInternal;
  }

  static getInstance() {
    if (AppStore.instance === undefined) {
      AppStore.instance = new AppStore();
    }

    return AppStore.instance;
  }

  async init() {
    const storedState = await AppStore.getStoredState("{}");
    const persistedState = await AppStore.deserialize(storedState);

    this.storeInternal = createStore(
      AppStore.getCombinedReducers(),
      persistedState,
      AppStore.getMiddleware(),
    );

    this.storeInternal.subscribe(() =>
      AppStore.serializeAndStore(this.storeInternal.getState()),
    );

    wrapStore(this.storeInternal, {
      portName: AppStore.PORT_NAME,
    });

    return this.storeInternal;
  }

  static connect() {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        let store = new Store({ portName: AppStore.PORT_NAME });
        await store.ready();
        clearInterval(interval);
        resolve(store);
      }, 100);
    });
  }

  static getCombinedReducers() {
    return combineReducers({
      app: appReducer,
      auth: authReducer,
      register: registerReducer,
    });
  }

  static getMiddleware() {
    return applyMiddleware(watcher, alias(aliases), thunk);
  }

  static async createState() {
    const state = await AppStore.deserialize("{}");
    await AppStore.serializeAndStore(state);
  }

  static getStoredState(ifNull = undefined) {
    return StorageService.getItem(AppStore.STATE_ALIAS, ifNull);
  }

  static setStoredState(state) {
    return StorageService.setItem(AppStore.STATE_ALIAS, state);
  }

  static async serializeAndStore(state) {
    const serializedState = await AppStore.serialize(state);
    await AppStore.setStoredState(serializedState);
  }

  static async deserialize(state) {
    const deserializedState = JSON.parse(state);

    return {
      app: await appRestore(deserializedState.app),
      auth: await authRestore(deserializedState.auth),
    };
  }

  static async serialize(state) {
    return JSON.stringify({
      app: await appStore(state.app),
      auth: await authStore(state.auth),
    });
  }

  static async clearStorage() {
    await AppStore.setStoredState(null);
  }

  static reset() {
    return AppStore.clearStorage();
  }
}

const store = AppStore.getInstance();

export default store;
