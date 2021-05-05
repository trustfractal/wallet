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

import Register from "@popup/components/Register";

import WindowsService from "@services/WindowsService";

function RegisterScreen() {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(isSignUpLoading);
  const signUpError = useAppSelector(getSignUpError);

  const onClickTerms = () =>
    WindowsService.openTab(
      "https://staging.sandbox.fractal.id/documents/2a087b14d7480181512ee1ab926a34eb/credentials-user-agreement.pdf",
    );
  const onClickPrivacyPolicy = () =>
    WindowsService.openTab(
      "https://staging.sandbox.fractal.id/documents/2a087b14d7480181512ee1ab926a34eb/credentials-user-agreement.pdf",
    );

  const onNext = (password: string) => {
    dispatch(registerActions.setRegisterPassword(password));
    dispatch(authActions.signUpRequest());
  };

  return (
    <Register
      onNext={onNext}
      onClickTerms={onClickTerms}
      onClickPrivacyPolicy={onClickPrivacyPolicy}
      loading={isLoading}
      error={signUpError}
    />
  );
}

export default RegisterScreen;
