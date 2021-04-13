import authActions from "@redux/stores/application/reducers/auth";
import registerActions from "@redux/stores/application/reducers/register";

import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";

import {
  getSignUpError,
  isSignUpLoading,
} from "@redux/stores/application/reducers/auth/selectors";

import "@popup/styles.css";

function WalletSetup() {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(isSignUpLoading);
  const signUpError = useAppSelector(getSignUpError);

  const onClick = () => {
    dispatch(
      registerActions.setRegisterAccount(
        "0x82d62eb3bcb391fe26b9b2d4b15035d8cc0e5579",
      ),
    );
    dispatch(authActions.signUpRequest());
  };

  return (
    <div className="Popup">
      <h2>Ethereum Wallet Detected!</h2>
      <div>
        <p>
          Press the below button to request read permissions from the wallet.
        </p>
        <br />
        {signUpError.length > 0 && <p>{signUpError}</p>}
      </div>
      <button onClick={onClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Request"}
      </button>
    </div>
  );
}

export default WalletSetup;
