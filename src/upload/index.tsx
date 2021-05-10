import ReactDOM from "react-dom";

import GlobalStyle from "./styles/GlobalStyle";
import UploadScreen from "./containers/UploadScreen";

import { UserContextProvider } from "@redux/stores/user/context";

function Upload() {
  return (
    <>
      <GlobalStyle />
      <UserContextProvider>
        <UploadScreen />
      </UserContextProvider>
    </>
  );
}

if (document.getElementById("upload")) {
  ReactDOM.render(<Upload />, document.getElementById("upload"));
}
