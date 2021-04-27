import { useHistory } from "react-router";

import Home from "@popup/components/Home";

import { useUserSelector } from "@redux/stores/user/context";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";

import "@popup/styles.css";
import RoutesPaths from "@popup/routes/paths";
import { useAppSelector } from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

function HomeScreen() {
  const history = useHistory();

  const account = useUserSelector(getAccount);
  const credentials = useUserSelector(getCredentials);
  const setup = useAppSelector(isSetup);

  // redirect to wallet connect
  if (!setup) {
    history.push(RoutesPaths.CONNECT_WALLET);
  }

  return <Home account={account} credentials={credentials} />;
}

export default HomeScreen;
