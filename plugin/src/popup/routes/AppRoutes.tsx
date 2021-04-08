import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Home from "@popup/containers/Home";

import RequestsIndex from "@popup/containers/RequestsIndex";
import RequestsShow from "@popup/containers/RequestsShow";

import CredentialsIndex from "@popup/containers/CredentialsIndex";
import CredentialsShow from "@popup/containers/CredentialsShow";

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/credentials/:id" component={CredentialsShow} />
      <Route path="/credentials" component={CredentialsIndex} />
      <Route path="/requests/:id" component={RequestsShow} />
      <Route path="/requests" component={RequestsIndex} />
      <Route path="/" component={Home} />
      <Redirect to="/" />
    </Switch>
  </Router>
);

export default Routes;
