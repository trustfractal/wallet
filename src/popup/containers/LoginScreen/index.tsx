import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";
import { useState } from "react";

import authActions from "@redux/stores/application/reducers/auth";

import {
  getSignInError,
  isSignInLoading,
} from "@redux/stores/application/reducers/auth/selectors";

import Login from "@popup/components/Login";

function LoginScreen() {
  const appDispatch = useAppDispatch();

  // Override showing the error initially since if a user fails to login once,
  // the redux store will permanently have a sign-in error set.
  const [includeError, setIncludeError] = useState(false);

  const isLoading = useAppSelector(isSignInLoading);
  const error = useAppSelector(getSignInError);

  const onNext = (password: string) => {
    appDispatch(authActions.signInRequest(password));
    setIncludeError(true);
  };

  return (
    <Login
      loading={isLoading}
      error={includeError ? error : undefined}
      onNext={onNext}
    />
  );
}

export default LoginScreen;
