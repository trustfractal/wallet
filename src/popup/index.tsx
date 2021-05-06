import ReactDOM from "react-dom";

import App from "@popup/app";

import { AppContextProvider } from "@redux/stores/application/context";

import GlobalStyle from "./styles/GlobalStyle";

function Popup() {
  return (
    <>
      <GlobalStyle />
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </>
  );
}

ReactDOM.render(<Popup />, document.getElementById("popup"));
