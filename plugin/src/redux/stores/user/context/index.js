import { useState, useEffect, createContext } from "react";
import {
  Provider as ReduxProvider,
  createStoreHook,
  createDispatchHook,
  createSelectorHook,
} from "react-redux";

import Loading from "@popup/containers/Loading";

import { UserStore } from "@redux/stores/user";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [store, setStore] = useState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isReady) {
      const setupStore = async () => {
        setStore(await UserStore.connect());
        setIsReady(true);
      };

      setupStore();
    }
  }, [isReady]);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <ReduxProvider store={store} context={UserContext}>
      {children}
    </ReduxProvider>
  );
};

export const useUserStore = createStoreHook(UserContext);
export const useUserDispatch = createDispatchHook(UserContext);
export const useUserSelector = createSelectorHook(UserContext);
