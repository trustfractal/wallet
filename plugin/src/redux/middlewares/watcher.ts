import { WatcherInvokation } from "@fractalwallet/types";

import Watcher from "@models/Watcher";

export const watcher = new Watcher();

function createActionsWatcherMiddleware() {
  return () => (next: (action: WatcherInvokation) => void) => (
    action: WatcherInvokation,
  ) => {
    watcher.invoke(action);

    return next(action);
  };
}

const middleware = createActionsWatcherMiddleware();

export default middleware;
