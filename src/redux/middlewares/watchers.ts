import { WatcherInvokation } from "@pluginTypes/index";

import Watcher from "@models/Watcher";
import AuthWatcher from "@models/Watcher/AuthWatcher";
import RequestsWatcher from "@models/Watcher/RequestsWatcher";

export const watcher = new Watcher();
export const authWatcher = new AuthWatcher();
export const requestsWatcher = new RequestsWatcher();

function createActionsWatchersMiddleware() {
  return () =>
    (next: (action: WatcherInvokation) => void) =>
    (action: WatcherInvokation) => {
      watcher.invoke(action);
      authWatcher.invoke(action);
      requestsWatcher.invoke(action);

      return next(action);
    };
}

const middleware = createActionsWatchersMiddleware();

export default middleware;
