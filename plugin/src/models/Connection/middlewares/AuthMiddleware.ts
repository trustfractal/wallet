import { IMiddleware, IInvokation } from "@fractalwallet/types";
import { authWatcher, setupWatcher } from "@redux/middlewares/watcher";

import AppStore from "@redux/stores/application";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import { isLoggedIn } from "@redux/stores/application/reducers/auth/selectors";
import WindowsService from "@services/WindowsService";

function loginFlow(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    let unlisten = () => {};

    // create normal popup to login
    const window = await WindowsService.createPopup();

    if (!window) {
      throw new Error("Could not create extension popup to login");
    }

    // register a listener for on close window event
    chrome.windows.onRemoved.addListener((windowId) => {
      if (windowId === window.id) {
        reject("login failed");
        unlisten();
      }
    });

    // create callbacks
    const onLoginSuccess = async () => {
      // close login popup
      await WindowsService.closeWindow(window.id);

      // resolve promise
      resolve();
    };

    const onLoginFailed = async () => {
      // let the user try again
    };

    const onTimeout = async () => {
      // close login popup
      await WindowsService.closeWindow(window.id);

      // resolve promise
      reject("login timed out");
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
    let unlisten = () => {};

    // create normal popup to setup
    const window = await WindowsService.createPopup();

    if (!window) {
      throw new Error("Could not create extension popup to setup");
    }

    // register a listener for on close window event
    chrome.windows.onRemoved.addListener((windowId) => {
      if (windowId === window.id) {
        reject("setup failed");
        unlisten();
      }
    });

    // create callbacks
    const onSetupSuccess = async () => {
      // close setup popup
      await WindowsService.closeWindow(window.id);

      // resolve promise
      resolve();
    };

    const onSetupFailed = async (error: any) => reject(error);
    const onTimeout = async () => {
      // close setup popup
      await WindowsService.closeWindow(window.id);

      // resolve promise
      reject("setup timed out");
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
  public async apply(_invokation: IInvokation): Promise<void> {
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
