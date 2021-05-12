import { useHistory } from "react-router";

import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";

import walletActions from "@redux/stores/user/reducers/wallet";

import ConnectWalletRequest from "@popup/components/ConnectWalletRequest";
import ConnectWalletCompleted from "@popup/components/ConnectWalletCompleted";

import {
  getAccount,
  getConnectWalletError,
  isConnectWalletLoading,
} from "@redux/stores/user/reducers/wallet/selectors";
import RoutesPaths from "@popup/routes/paths";
import { useAppSelector } from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

function ConnectWalletScreen() {
  const dispatch = useUserDispatch();
  const history = useHistory();

  const isLoading = useUserSelector(isConnectWalletLoading);
  const error = useUserSelector(getConnectWalletError);
  const account = useUserSelector(getAccount);
  const setup = useAppSelector(isSetup);

  const onDone = () => history.replace(RoutesPaths.WALLET);
  const onConnect = () => dispatch(walletActions.connectWalletRequest());

  if (setup) {
    return <ConnectWalletCompleted onNext={onDone} account={account} />;
  }

  return (
    <ConnectWalletRequest
      onNext={onConnect}
      error={error}
      loading={isLoading}
    />
  );
}

export default ConnectWalletScreen;
