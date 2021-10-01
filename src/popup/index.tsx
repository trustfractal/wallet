import ReactDOM from "react-dom";
import App from "@popup/app";
import { AppContextProvider } from "@redux/stores/application/context";
import GlobalStyle from "./styles/GlobalStyle";
import { getMultiContext } from "@services/Factory";

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
if (document.getElementById("popup")) {
  ReactDOM.render(<Popup />, document.getElementById("popup"));
}
getMultiContext().inPopup();
