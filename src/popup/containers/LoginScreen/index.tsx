import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";

import authActions from "@redux/stores/application/reducers/auth";

import {
  getSignInError,
  isSignInLoading,
} from "@redux/stores/application/reducers/auth/selectors";

import Login from "@popup/components/Login";

function LoginScreen() {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(isSignInLoading);
  const error = useAppSelector(getSignInError);

  const onNext = (password: string) =>
    dispatch(authActions.signInRequest(password));

  return <Login loading={isLoading} error={error} onNext={onNext} />;
}

export default LoginScreen;
