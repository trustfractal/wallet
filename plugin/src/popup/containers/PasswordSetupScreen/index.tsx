import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";
import authActions from "@redux/stores/application/reducers/auth";
import registerActions from "@redux/stores/application/reducers/register";

import {
  getSignUpError,
  isSignUpLoading,
} from "@redux/stores/application/reducers/auth/selectors";

import PasswordSetup from "@popup/components/PasswordSetup";

import "@popup/styles.css";

function PasswordSetupScreen() {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(isSignUpLoading);
  const signUpError = useAppSelector(getSignUpError);

  const onNext = (password: string) => {
    dispatch(registerActions.setRegisterPassword(password));
    dispatch(authActions.signUpRequest());
  };

  return (
    <PasswordSetup onNext={onNext} loading={isLoading} error={signUpError} />
  );
}

export default PasswordSetupScreen;
