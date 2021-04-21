import { WatcherInvokation } from "@fractalwallet/types";

import Watcher from "@models/Watcher";
import AuthWatcher from "@models/Watcher/AuthWatcher";
import SetupWatcher from "@models/Watcher/SetupWatcher";

export const watcher = new Watcher();
export const authWatcher = new AuthWatcher();
export const setupWatcher = new SetupWatcher();

function createActionsWatcherMiddleware() {
  return () => (next: (action: WatcherInvokation) => void) => (
    action: WatcherInvokation,
  ) => {
    watcher.invoke(action);
    authWatcher.invoke(action);
    setupWatcher.invoke(action);

    return next(action);
  };
}

const middleware = createActionsWatcherMiddleware();

export default middleware;
