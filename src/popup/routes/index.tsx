import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import WalletScreen from "@popup/containers/WalletScreen";
import AboutScreen from "@popup/containers/AboutScreen";
import MnemonicScreen from "@popup/containers/MnemonicScreen";
import ImportMnemonicScreen from "@popup/containers/ImportMnemonicScreen";

import ConnectFractalScreen from "@popup/containers/ConnectFractalScreen";

import RequestsIndexScreen from "@popup/containers/RequestsIndexScreen";
import RequestsShowScreen from "@popup/containers/RequestsShowScreen";

import RoutesPaths from "./paths";

const Routes = () => (
  <Router>
    <Switch>
      <Route path={RoutesPaths.ABOUT} component={AboutScreen} />
      <Route
        path={RoutesPaths.IMPORT_MNEMONIC}
        component={ImportMnemonicScreen}
      />
      <Route path={RoutesPaths.MNEMONIC} component={MnemonicScreen} />
      <Route
        path={RoutesPaths.CONNECT_FRACTAL}
        component={ConnectFractalScreen}
      />
      <Route path={RoutesPaths.REQUESTS_INDEX}>
        <Switch>
          <Route
            path={RoutesPaths.REQUESTS_SHOW}
            component={RequestsShowScreen}
          />
          <Route
            path={RoutesPaths.REQUESTS_INDEX}
            component={RequestsIndexScreen}
          />
        </Switch>
      </Route>
      <Route path={RoutesPaths.WALLET} component={WalletScreen} />
      <Redirect to={RoutesPaths.WALLET} />
    </Switch>
  </Router>
);

export default Routes;
