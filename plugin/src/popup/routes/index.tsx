import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import HomeScreen from "@popup/containers/HomeScreen";

import RequestsIndex from "@popup/containers/RequestsIndex";
import RequestsShow from "@popup/containers/RequestsShow";

import CredentialsIndex from "@popup/containers/CredentialsIndex";
import CredentialsShow from "@popup/containers/CredentialsShow";

import ConnectWalletScreen from "@popup/containers/ConnectWalletScreen";
import RoutesPaths from "./paths";

const Routes = () => (
  <Router>
    <Switch>
      <Route
        path={RoutesPaths.CONNECT_WALLET}
        component={ConnectWalletScreen}
      />
      <Route path={RoutesPaths.CREDENTIALS_SHOW} component={CredentialsShow} />
      <Route
        path={RoutesPaths.CREDENTIALS_INDEX}
        component={CredentialsIndex}
      />
      <Route path={RoutesPaths.REQUESTS_SHOW} component={RequestsShow} />
      <Route path={RoutesPaths.REQUESTS_INDEX} component={RequestsIndex} />
      <Route path={RoutesPaths.HOME} component={HomeScreen} />
      <Redirect to={RoutesPaths.HOME} />
    </Switch>
  </Router>
);

export default Routes;
