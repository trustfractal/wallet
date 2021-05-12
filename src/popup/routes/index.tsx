import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import WalletScreen from "@popup/containers/WalletScreen";

import ConnectWalletScreen from "@popup/containers/ConnectWalletScreen";
import RoutesPaths from "./paths";

const Routes = () => (
  <Router>
    <Switch>
      <Route
        path={RoutesPaths.CONNECT_WALLET}
        component={ConnectWalletScreen}
      />
      <Route path={RoutesPaths.WALLET} component={WalletScreen} />
      <Redirect to={RoutesPaths.WALLET} />
    </Switch>
  </Router>
);

export default Routes;
