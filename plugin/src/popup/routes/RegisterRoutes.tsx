import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import WelcomeScreen from "@popup/containers/WelcomeScreen";
import WalletSetupScreen from "@popup/containers/WalletSetupScreen";
import PasswordSetupScreen from "@popup/containers/PasswordSetupScreen";

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/password-setup" component={PasswordSetupScreen} />
      <Route path="/wallet-setup" component={WalletSetupScreen} />
      <Route path="/" component={WelcomeScreen} />
      <Redirect to="/" />
    </Switch>
  </Router>
);

export default Routes;
