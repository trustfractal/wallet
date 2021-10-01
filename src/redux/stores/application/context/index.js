import { useState, useEffect, createContext } from "react";
import {
  Provider as ReduxProvider,
  createDispatchHook,
  createSelectorHook,
} from "react-redux";

import LoadingScreen from "@popup/containers/LoadingScreen";

import { AppStore } from "@redux/stores/application";

const AppContext = createContext(null);

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
    return <LoadingScreen />;
  }

  return (
    <ReduxProvider store={store} context={AppContext}>
      {children}
    </ReduxProvider>
  );
};

export const useAppDispatch = createDispatchHook(AppContext);
export const useAppSelector = createSelectorHook(AppContext);
