import { useHistory } from "react-router";

import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";

import walletActions from "@redux/stores/user/reducers/wallet";

import ConnectBackendRequest from "@popup/components/ConnectBackendRequest";

import {
  getConnectWalletError,
  isConnectWalletLoading,
} from "@redux/stores/user/reducers/wallet/selectors";
import RoutesPaths from "@popup/routes/paths";
import { useAppSelector } from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

function ConnectBackendScreen() {
  const dispatch = useUserDispatch();
  const history = useHistory();

  const isLoading = useUserSelector(isConnectWalletLoading);
  const error = useUserSelector(getConnectWalletError);
  const setup = useAppSelector(isSetup);

  const onConnect = () => dispatch(walletActions.connectWalletRequest());

  if (setup) {
    history.replace(RoutesPaths.WALLET);
  }

  return (
    <ConnectBackendRequest
      onNext={onConnect}
      error={error}
      loading={isLoading}
    />
  );
}

export default ConnectBackendScreen;
