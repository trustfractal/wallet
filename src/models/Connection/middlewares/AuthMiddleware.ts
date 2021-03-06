import {
  ERROR_LOGIN_TIMEOUT,
  ERROR_LOGIN_WINDOW_CLOSED,
  ERROR_LOGIN_WINDOW_OPEN,
} from "@models/Connection/Errors";
import { IMiddleware } from "@pluginTypes/index";
import { authWatcher, setupWatcher } from "@redux/middlewares/watchers";
import AppStore from "@redux/stores/application";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import {
  isLoggedIn,
  isRegistered,
} from "@redux/stores/application/reducers/auth/selectors";
import { getWindowsService } from "@services/Factory";
import { PopupSizes } from "@services/WindowsService";

function loginFlow(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const registered = isRegistered(AppStore.getStore().getState());

    let unlisten = () => {};
    let resolved = false;
    let size = PopupSizes.MEDIUM;

    if (registered) {
      size = PopupSizes.SMALL;
    }

    const window = await getWindowsService().createPopup(size);

    if (window === undefined) {
      reject(ERROR_LOGIN_WINDOW_OPEN());
      return;
    }

    // register a listener for on close window event
    chrome.windows.onRemoved.addListener((windowId) => {
      if (windowId === window!.id && !resolved) {
        unlisten();
        reject(ERROR_LOGIN_WINDOW_CLOSED());
      }
    });

    // create callbacks
    const onLoginSuccess = async () => {
      resolved = true;

      // close login popup
      await getWindowsService().closeWindow(window!.id);

      // resolve promise
      resolve();
    };

    const onLoginFailed = () => {
      // let the user try again
    };

    const onTimeout = async () => {
      resolved = true;

      // close login popup
      await getWindowsService().closeWindow(window!.id);

      // resolve promise
      reject(ERROR_LOGIN_TIMEOUT());
    };

    // register listener
    const subscribed = authWatcher.listenForLogin(
      onLoginSuccess,
      onLoginFailed,
      onTimeout,
    );
    unlisten = subscribed.unlisten;
  });
}

function setupFlow(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const registered = isRegistered(AppStore.getStore().getState());

    let unlisten = () => {};
    let resolved = false;
    let size = PopupSizes.MEDIUM;

    if (registered) {
      size = PopupSizes.SMALL;
    }

    // create normal popup to setup
    const window = await getWindowsService().createPopup(size);

    if (window === undefined) {
      reject(ERROR_LOGIN_WINDOW_OPEN());
      return;
    }

    // register a listener for on close window event
    chrome.windows.onRemoved.addListener((windowId) => {
      if (windowId === window!.id && !resolved) {
        unlisten();
        reject(ERROR_LOGIN_WINDOW_CLOSED());
      }
    });

    // create callbacks
    const onSetupSuccess = async () => {
      resolved = true;

      // close setup popup
      await getWindowsService().closeWindow(window.id);

      // resolve promise
      resolve();
    };

    const onSetupFailed = async (error: any) => {
      resolved = true;
      reject(error);
    };

    const onTimeout = async () => {
      resolved = true;

      // close setup popup
      await getWindowsService().closeWindow(window.id);

      // resolve promise
      reject(ERROR_LOGIN_TIMEOUT());
    };

    // register listener
    const subscribed = setupWatcher.listenForSetup(
      onSetupSuccess,
      onSetupFailed,
      onTimeout,
    );
    unlisten = subscribed.unlisten;
  });
}

export default class AuthMiddleware implements IMiddleware {
  public async apply(): Promise<void> {
    // check if user is authenticated
    const loggedIn = isLoggedIn(AppStore.getStore().getState());
    const setup = isSetup(AppStore.getStore().getState());

    if (loggedIn && setup) {
      return;
    }

    // check if is only required to login
    if (setup) {
      await loginFlow();
    } else {
      await setupFlow();
    }
  }
}
