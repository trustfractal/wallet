import { useHistory } from "react-router";

import Home from "@popup/components/Home";

import { useUserSelector } from "@redux/stores/user/context";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";

import "@popup/styles.css";
import RoutesPaths from "@popup/routes/paths";

function HomeScreen() {
  const history = useHistory();

  const account = useUserSelector(getAccount);

  // redirect to wallet connect
  if (account.length === 0) {
    history.push(RoutesPaths.CONNECT_WALLET);
  }

  return <Home account={account} />;
}

export default HomeScreen;
