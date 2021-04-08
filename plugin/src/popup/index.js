import ReactDOM from "react-dom";

import App from "@popup/app";

import { AppContextProvider } from "@redux/stores/application/context";

function Popup() {
  return (
    <AppContextProvider>
      <App />
    </AppContextProvider>
  );
}

ReactDOM.render(<Popup />, document.getElementById("popup"));
