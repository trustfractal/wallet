import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";
import { useUserDispatch } from "@redux/stores/user/context";

import appActions from "@redux/stores/application/reducers/app";
import authActions from "@redux/stores/application/reducers/auth";

import {
  getSignInError,
  isSignInLoading,
} from "@redux/stores/application/reducers/auth/selectors";

import Login from "@popup/components/Login";
import { importFile } from "@utils/FileUtils";

import { AppStore } from "@redux/stores/application";
import { UserStore } from "@redux/stores/user";

function LoginScreen() {
  const appDispatch = useAppDispatch();
  const userDispatch = useAppDispatch();

  const isLoading = useAppSelector(isSignInLoading);
  const error = useAppSelector(getSignInError);

  const onNext = (password: string) =>
    appDispatch(authActions.signInRequest(password));

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
    <Login
      loading={isLoading}
      error={error}
      onNext={onNext}
      onImport={onImport}
    />
  );
}

export default LoginScreen;
