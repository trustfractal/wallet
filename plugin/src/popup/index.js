import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Store } from "webext-redux";
import { Provider as ReduxProvider } from "react-redux";

import App from "@popup/app";
import Loading from "@popup/views/loading";

function getStore() {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      let store = new Store();
      await store.ready();
      clearInterval(interval);
      resolve(store);
    }, 100);
  });
}

function Popup() {
  const [store, setStore] = useState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isReady) {
      async function setupStore() {
        setStore(await getStore());
        setIsReady(true);
      }

      setupStore();
    }
  }, [isReady]);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  );
}

ReactDOM.render(<Popup />, document.getElementById("popup"));
