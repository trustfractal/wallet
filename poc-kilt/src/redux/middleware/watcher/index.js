import Watcher from "@models/Watcher";

export const watcher = new Watcher();

function createActionsWatcherMiddleware() {
  return () => (next) => (action) => {
    watcher.invoke(action);

    return next(action);
  };
}

const middleware = createActionsWatcherMiddleware();

export default middleware;
