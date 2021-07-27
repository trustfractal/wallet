import appActions, { appTypes } from "@redux/stores/application/reducers/app";

import CredentialsPolling from "@models/Polling/CredentialsPolling";

export const startup = () => {
  return async (dispatch) => {
    // start credentials status polling
    new CredentialsPolling().start();

    // get app version
    // eslint-disable-next-line no-undef
    const { version } = chrome.runtime.getManifest();

    dispatch(appActions.setVersion(version));
    dispatch(appActions.setLaunched(true));
  };
};

const Aliases = {
  [appTypes.STARTUP]: startup,
};

export default Aliases;
