import { useHistory } from "react-router";

import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";

import walletActions from "@redux/stores/user/reducers/wallet";

import ConnectWalletRequest from "@popup/components/ConnectWalletRequest";
import ConnectWalletCompleted from "@popup/components/ConnectWalletCompleted";

import "@popup/styles.css";
import {
  getAccount,
  getConnectWalletError,
  isConnectWalletLoading,
} from "@redux/stores/user/reducers/wallet/selectors";
import RoutesPaths from "@popup/routes/paths";

function ConnectWalletScreen() {
  const dispatch = useUserDispatch();
  const history = useHistory();

  const isLoading = useUserSelector(isConnectWalletLoading);
  const error = useUserSelector(getConnectWalletError);
  const account = useUserSelector(getAccount);

  const onDone = () => history.replace(RoutesPaths.HOME);
  const onConnect = () => dispatch(walletActions.connectWalletRequest());

  if (account.length > 0) {
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
