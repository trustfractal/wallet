import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import withRedirectToQueryRoute from "@popup/hooks/withRedirectToQueryRoute";
import AuthRoutes from "@popup/middleware/AuthRoutes";

import CredentialsIndex from "@popup/views/credentials";

import DataIndex from "@popup/views/data";
import DataCreate from "@popup/views/data/create";

import RequestsIndex from "@popup/views/requests";
import RequestsShow from "@popup/views/requests/show";

import Home from "@popup/views/home";
import Landing from "@popup/views/landing";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/landing" component={Landing} />
        <AuthRoutes>
          <Switch>
            <Route path="/data">
              <Switch>
                <Route path="/data/create" component={DataCreate} />
                <Route path="/" component={DataIndex} />
              </Switch>
            </Route>
            <Route path="/credentials" component={CredentialsIndex} />
            <Route path="/requests/:id" component={RequestsShow} />
            <Route path="/requests" component={RequestsIndex} />
            <Route path="/" component={withRedirectToQueryRoute(Home)} />
          </Switch>
        </AuthRoutes>
      </Switch>
    </Router>
  );
}

export default App;
