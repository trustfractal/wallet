import { useState, useEffect, createContext } from "react";
import {
  Provider as ReduxProvider,
  createStoreHook,
  createDispatchHook,
  createSelectorHook,
} from "react-redux";

import Loading from "@popup/containers/Loading";

import { AppStore } from "@redux/stores/application";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [store, setStore] = useState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isReady) {
      const setupStore = async () => {
        setStore(await AppStore.connect());
        setIsReady(true);
      };

      setupStore();
    }
  }, [isReady]);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <ReduxProvider store={store} context={AppContext}>
      {children}
    </ReduxProvider>
  );
};

export const useAppStore = createStoreHook(AppContext);
export const useAppDispatch = createDispatchHook(AppContext);
export const useAppSelector = createSelectorHook(AppContext);
