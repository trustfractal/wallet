import { useHistory } from "react-router";

import Home from "@popup/components/Home";
import EmptyCredentials from "@popup/components/EmptyCredentials";

import { useUserSelector } from "@redux/stores/user/context";

import RoutesPaths from "@popup/routes/paths";
import { useAppSelector } from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

import WindowsService from "@services/WindowsService";
import environment from "@environment/index";

function HomeScreen() {
  const history = useHistory();

  const credentials = useUserSelector(getCredentials);
  const setup = useAppSelector(isSetup);

  // redirect to wallet connect
  if (!setup) {
    history.push(RoutesPaths.CONNECT_WALLET);
  }

  return (
    <Home
      credentials={credentials}
      onClickPool={() =>
        WindowsService.openTab(
          `https://${environment.FRACTAL_WEBSITE_HOSTNAME}/staking`,
        )
      }
      onClickEmpty={() =>
        WindowsService.openTab(
          `https://${environment.FRACTAL_WEBSITE_HOSTNAME}/credentials`,
        )
      }
    />
  );
}

export default HomeScreen;
