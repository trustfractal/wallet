import { useHistory } from "react-router";

import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";

import walletActions from "@redux/stores/user/reducers/wallet";

import ConnectWalletRequest from "@popup/components/ConnectWalletRequest";
import ConnectWalletCompleted from "@popup/components/ConnectWalletCompleted";

import {
  getAccount,
  getConnectWalletError,
  isConnectWalletLoading,
  isConnectWalletSuccess,
} from "@redux/stores/user/reducers/wallet/selectors";
import RoutesPaths from "@popup/routes/paths";

function ConnectWalletScreen() {
  const dispatch = useUserDispatch();
  const history = useHistory();

  const isLoading = useUserSelector(isConnectWalletLoading);
  const isSuccess = useUserSelector(isConnectWalletSuccess);
  const error = useUserSelector(getConnectWalletError);
  const account = useUserSelector(getAccount);

  const onDone = () => {
    dispatch(walletActions.connectWalletReset());
    history.replace(RoutesPaths.WALLET);
  };
  const onConnect = () => dispatch(walletActions.connectWalletRequest());

  if (isSuccess) {
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
