import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Welcome from "@popup/containers/Welcome";
import PasswordSetup from "@popup/containers/PasswordSetup";
import WalletSetup from "@popup/containers/WalletSetup";
import NoWalletDetected from "@popup/containers/NoWalletDetected";

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/wallet-setup" component={WalletSetup} />
      <Route path="/no-wallet-detected" component={NoWalletDetected} />
      <Route path="/password-setup" component={PasswordSetup} />
      <Route path="/" component={Welcome} />
      <Redirect to="/" />
    </Switch>
  </Router>
);

export default Routes;
