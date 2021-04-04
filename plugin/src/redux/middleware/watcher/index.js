import Watcher from "@models/Watcher";
import RequestsWatcher from "@models/Watcher/RequestsWatcher";

export const watcher = new Watcher();
export const requestsWatcher = new RequestsWatcher();

function createActionsWatcherMiddleware() {
  return () => (next) => (action) => {
    watcher.invoke(action);
    requestsWatcher.invoke(action);

    return next(action);
  };
}

const middleware = createActionsWatcherMiddleware();

export default middleware;
