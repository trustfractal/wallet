import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import HomeScreen from "@popup/containers/HomeScreen";

import ConnectWalletScreen from "@popup/containers/ConnectWalletScreen";
import RoutesPaths from "./paths";

const Routes = () => (
  <Router>
    <Switch>
      <Route
        path={RoutesPaths.CONNECT_WALLET}
        component={ConnectWalletScreen}
      />
      <Route path={RoutesPaths.HOME} component={HomeScreen} />
      <Redirect to={RoutesPaths.HOME} />
    </Switch>
  </Router>
);

export default Routes;
