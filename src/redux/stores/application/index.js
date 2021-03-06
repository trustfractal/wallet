import { createStore, combineReducers, applyMiddleware } from "redux";
import { Store, alias, wrapStore } from "webext-redux";
import thunk from "redux-thunk";

import { getStorageService } from "@services/Factory";

import aliases from "@redux/stores/application/aliases";
import watchers from "@redux/middlewares/watchers";

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
import {
  reducer as metadataReducer,
  restore as metadataRestore,
  store as metadataStore,
} from "@redux/stores/application/reducers/metadata";
import { reducer as registerReducer } from "@redux/stores/application/reducers/register";

export class AppStore {
  static instance = undefined;

  static STATE_ALIAS = "app-state";
  static PORT_NAME = "app-state-port";

  constructor() {
    this.storeInternal = undefined;
  }

  getStore() {
    return this.storeInternal;
  }

  static getInstance() {
    if (AppStore.instance === undefined) {
      AppStore.instance = new AppStore();
    }

    return AppStore.instance;
  }

  async isInitialized() {
    return this.storeInternal !== undefined;
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
      let interval;

      const connectToStore = async () => {
        let store = new Store({ portName: AppStore.PORT_NAME });
        await store.ready();
        if (interval) clearInterval(interval);
        resolve(store);
      };

      connectToStore();
      interval = setInterval(connectToStore, 1000);
    });
  }

  static getCombinedReducers() {
    return combineReducers({
      app: appReducer,
      auth: authReducer,
      register: registerReducer,
      metadata: metadataReducer,
    });
  }

  static getMiddleware() {
    return applyMiddleware(watchers, alias(aliases), thunk);
  }

  static async createState() {
    const state = await AppStore.deserialize("{}");
    await AppStore.serializeAndStore(state);
  }

  static getStoredState(ifNull = undefined) {
    return getStorageService().getItem(AppStore.STATE_ALIAS, ifNull);
  }

  static setStoredState(state) {
    return getStorageService().setItem(AppStore.STATE_ALIAS, state);
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
      metadata: await metadataRestore(deserializedState.metadata),
    };
  }

  static async serialize(state) {
    return JSON.stringify({
      app: await appStore(state.app),
      auth: await authStore(state.auth),
      metadata: await metadataStore(state.metadata),
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
