import appActions, { appTypes } from "@redux/stores/application/reducers/app";

import CredentialsPolling from "@models/Polling/CredentialsPolling";
import MaguroService from "@services/MaguroService";

export const startup = () => {
  return async (dispatch) => {
    // start credentials status polling
    new CredentialsPolling().start();

    // get app version
    // eslint-disable-next-line no-undef
    const { version } = chrome.runtime.getManifest();

    const { protocol_enabled: protocolEnabled } =
      await MaguroService.getConfig();

    dispatch(appActions.setVersion(version));
    dispatch(appActions.setProtocolEnabled(protocolEnabled));
    dispatch(appActions.setLaunched(true));
  };
};

const Aliases = {
  [appTypes.STARTUP]: startup,
};

export default Aliases;
