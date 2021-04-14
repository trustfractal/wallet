import { useHistory } from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";

import registerActions from "@redux/stores/application/reducers/register";

import { isWalletAvailable } from "@redux/stores/application/reducers/app/selectors";

import WalletSetup from "@popup/components/WalletSetup";
import NoWalletDetected from "@popup/components/NoWalletDetected";

import "@popup/styles.css";
import {
  getRegisterAccount,
  getWalletSetupError,
  isWalletSetupLoading,
} from "@redux/stores/application/reducers/register/selectors";

function WalletSetupScreen() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const isLoading = useAppSelector(isWalletSetupLoading);
  const account = useAppSelector(getRegisterAccount);
  const error = useAppSelector(getWalletSetupError);
  const isProviderAvailable = useAppSelector(isWalletAvailable);

  const onSetup = () => dispatch(registerActions.walletSetupRequest());
  const onNext = () => history.push("/password-setup");

  if (!isProviderAvailable) {
    return <NoWalletDetected />;
  }

  return (
    <WalletSetup
      onSetup={onSetup}
      onNext={onNext}
      account={account}
      error={error}
      loading={isLoading}
    />
  );
}

export default WalletSetupScreen;
