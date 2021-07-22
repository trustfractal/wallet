import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import WalletScreen from "@popup/containers/WalletScreen";
import AboutScreen from "@popup/containers/AboutScreen";

import RoutesPaths from "./paths";

const Routes = () => (
  <Router>
    <Switch>
      <Route path={RoutesPaths.ABOUT} component={AboutScreen} />
      <Route path={RoutesPaths.WALLET} component={WalletScreen} />
      <Redirect to={RoutesPaths.WALLET} />
    </Switch>
  </Router>
);

export default Routes;
