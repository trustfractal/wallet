import { useUserSelector } from "@redux/stores/user/context";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";
import Home from "@popup/components/Home";

import "@popup/styles.css";

function HomeScreen() {
  const account = useUserSelector(getAccount);

  return <Home account={account} />;
}

export default HomeScreen;
