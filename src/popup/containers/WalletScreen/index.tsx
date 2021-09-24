import { useHistory } from "react-router";

import HomeScreen from "@popup/containers/HomeScreen";

import { useUserSelector } from "@redux/stores/user/context";

import RoutesPaths from "@popup/routes/paths";

import { useAppSelector } from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import { getPendingRequests } from "@redux/stores/user/reducers/requests/selectors";

function WalletScreen() {
  const history = useHistory();

  const requests = useUserSelector(getPendingRequests);
  const setup = useAppSelector(isSetup);

  // redirect to fractal connect screen
  if (!setup) {
    history.push(RoutesPaths.CONNECT_FRACTAL);
    return null;
  }

  // check if requests
  if (requests.length !== 0) {
    history.push(RoutesPaths.REQUESTS_INDEX);
    return null;
  }

  return <HomeScreen />;
}

export default WalletScreen;
