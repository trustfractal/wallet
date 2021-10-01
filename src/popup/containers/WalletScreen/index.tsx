import { useHistory } from "react-router";
import HomeScreen from "@popup/containers/HomeScreen";
import { useUserSelector } from "@redux/stores/user/context";
import RoutesPaths from "@popup/routes/paths";
import { getPendingRequests } from "@redux/stores/user/reducers/requests/selectors";

function WalletScreen() {
  const history = useHistory();

  const requests = useUserSelector(getPendingRequests);

  // check if requests
  if (requests.length !== 0) {
    history.push(RoutesPaths.REQUESTS_INDEX);
    return null;
  }

  return <HomeScreen />;
}

export default WalletScreen;
