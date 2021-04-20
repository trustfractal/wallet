import { WatcherInvokation } from "@fractalwallet/types";

import Watcher from "@models/Watcher";
import AuthWatcher from "@models/Watcher/AuthWatcher";

export const watcher = new Watcher();
export const authWatcher = new AuthWatcher();

function createActionsWatcherMiddleware() {
  return () => (next: (action: WatcherInvokation) => void) => (
    action: WatcherInvokation,
  ) => {
    watcher.invoke(action);
    authWatcher.invoke(action);

    return next(action);
  };
}

const middleware = createActionsWatcherMiddleware();

export default middleware;
