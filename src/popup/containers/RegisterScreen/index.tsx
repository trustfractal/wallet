import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";
import { useUserDispatch } from "@redux/stores/user/context";

import appActions from "@redux/stores/application/reducers/app";
import authActions from "@redux/stores/application/reducers/auth";
import registerActions from "@redux/stores/application/reducers/register";

import {
  getSignUpError,
  isSignUpLoading,
} from "@redux/stores/application/reducers/auth/selectors";

import { AppStore } from "@redux/stores/application";
import { UserStore } from "@redux/stores/user";

import Register from "@popup/components/Register";

import WindowsService from "@services/WindowsService";

import environment from "@environment/index";

import { importFile } from "@utils/FileUtils";

function RegisterScreen() {
  const appDispatch = useAppDispatch();
  const userDispatch = useAppDispatch();

  const isLoading = useAppSelector(isSignUpLoading);
  const signUpError = useAppSelector(getSignUpError);

  const onClickTerms = () =>
    WindowsService.createTab({
      url: `${environment.FRACTAL_WEBSITE_URL}/documents/end-user-agreement`,
    });
  const onClickPrivacyPolicy = () =>
    WindowsService.createTab({
      url: `${environment.FRACTAL_WEBSITE_URL}/documents/privacy-policy`,
    });

  const onNext = (password: string) => {
    appDispatch(registerActions.setRegisterPassword(password));
    appDispatch(authActions.signUpRequest());
  };

  const onImport = async () => {
    try {
      const fileContent = importFile();
      const stores = JSON.parse(fileContent);

      if (stores.app === undefined || stores.user === undefined) {
        throw new Error("Invalid file");
      }

      const userStore = await UserStore.deserialize(stores.user);
      const appStore = await AppStore.deserialize(stores.app);

      // userDispatch(appActions.reset(userStore));
      appDispatch(appActions.reset(appStore));
    } catch (error) {}
  };

  return (
    <Register
      onNext={onNext}
      onClickTerms={onClickTerms}
      onClickPrivacyPolicy={onClickPrivacyPolicy}
      onImport={onImport}
      loading={isLoading}
      error={signUpError}
    />
  );
}

export default RegisterScreen;
