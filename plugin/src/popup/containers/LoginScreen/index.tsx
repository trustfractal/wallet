import { useAppDispatch, useAppSelector } from "@redux/application/context";

import authActions from "@redux/application/reducers/auth";

import {
  getSignInError,
  isSignInLoading,
} from "@redux/application/reducers/auth/selectors";

import Login from "@popup/components/Login";

import "@popup/styles.css";

function LoginScreen() {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(isSignInLoading);
  const error = useAppSelector(getSignInError);

  const onNext = (password: string) =>
    dispatch(authActions.signInRequest(password));

  return <Login loading={isLoading} error={error} onNext={onNext} />;
}

export default LoginScreen;
