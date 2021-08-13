import { useHistory } from "react-router";

import Credentials from "@popup/components/Credentials";
import EmptyCredentials from "@popup/components/EmptyCredentials";
import HomeScreen from "@popup/containers/HomeScreen";

import { useUserSelector } from "@redux/stores/user/context";

import RoutesPaths from "@popup/routes/paths";

import { useAppSelector } from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import { getPendingRequests } from "@redux/stores/user/reducers/requests/selectors";

function WalletScreen() {
  const history = useHistory();

  const credentials = useUserSelector(getCredentials);
  const requests = useUserSelector(getPendingRequests);
  const setup = useAppSelector(isSetup);

  // redirect to fractal connect screen
  if (!setup) {
    history.push(RoutesPaths.CONNECT_FRACTAL);
    return null;
  }

  // check if has credentials
  if (credentials.length === 0)
    return <HomeScreen credentials={EmptyCredentials} />;

  // check if requests
  if (requests.length !== 0) {
    history.push(RoutesPaths.REQUESTS_INDEX);
    return null;
  }

  return <HomeScreen credentials={Credentials} />;
}

export default WalletScreen;
