import { useHistory } from "react-router";

import HomeScreen from "@popup/containers/HomeScreen";
import RequestsScreen from "@popup/containers/RequestsScreen";

import EmptyCredentials from "@popup/components/EmptyCredentials";

import { useUserSelector } from "@redux/stores/user/context";

import RoutesPaths from "@popup/routes/paths";

import { useAppSelector } from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import { getPendingRequests } from "@redux/stores/user/reducers/requests/selectors";

import WindowsService from "@services/WindowsService";
import environment from "@environment/index";

function WalletScreen() {
  const history = useHistory();

  const credentials = useUserSelector(getCredentials);
  const requests = useUserSelector(getPendingRequests);
  const setup = useAppSelector(isSetup);

  // redirect to fractal connect screen
  if (!setup) {
    history.push(RoutesPaths.CONNECT_FRACTAL);
  }

  // check if has credentials
  if (credentials.length === 0) {
    return (
      <EmptyCredentials
        onNext={() =>
          WindowsService.openTab(
            `${environment.FRACTAL_WEBSITE_URL}/credentials`,
          )
        }
      />
    );
  }

  // check if requests
  if (requests.length !== 0) {
    return <RequestsScreen />;
  }

  return <HomeScreen />;
}

export default WalletScreen;
