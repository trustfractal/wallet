import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Store } from "webext-redux";
import { Provider as ReduxProvider } from "react-redux";

import App from "@popup/app";
import Loading from "@popup/views/loading";

const store = new Store();

function Popup() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function setupStore() {
      await store.ready();
      setIsReady(true);
    }

    setupStore();
  });

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
