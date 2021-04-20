import { useAppDispatch, useAppSelector } from "@redux/application/context";
import authActions from "@redux/application/reducers/auth";
import registerActions from "@redux/application/reducers/register";

import {
  getSignUpError,
  isSignUpLoading,
} from "@redux/application/reducers/auth/selectors";

import Register from "@popup/components/Register";

import "@popup/styles.css";

function RegisterScreen() {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(isSignUpLoading);
  const signUpError = useAppSelector(getSignUpError);

  const onNext = (password: string) => {
    dispatch(registerActions.setRegisterPassword(password));
    dispatch(authActions.signUpRequest());
  };

  return <Register onNext={onNext} loading={isLoading} error={signUpError} />;
}

export default RegisterScreen;
