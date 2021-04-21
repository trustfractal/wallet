import { IMiddleware, IInvokation } from "@fractalwallet/types";
import { authWatcher } from "@redux/middlewares/watcher";

import AppStore from "@redux/stores/application";
import { isLoggedIn } from "@redux/stores/application/reducers/auth/selectors";
import WindowsService from "@services/WindowsService";

export default class AuthMiddleware implements IMiddleware {
  public apply(invokation: IInvokation): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let unlisten = () => {};

      // check if user is authenticated
      const loggedIn = isLoggedIn(AppStore.getStore().getState());

      if (loggedIn) {
        return resolve();
      }

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
}
