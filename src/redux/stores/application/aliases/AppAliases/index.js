import appActions, { appTypes } from "@redux/stores/application/reducers/app";

import GoldfishService from "@services/GoldfishService";

import StakingDetailsPolling from "@models/Polling/StakingDetailsPolling";
import CredentialsStatusPolling from "@models/Polling/CredentialsStatusPolling";

export const startup = () => {
  return async (dispatch) => {
    // setup addresses
    const {
      stakingEnabled,
      fclContract,
      fclUniswapContract,
      stackingFclContract,
      stackingFclUniswapContract,
      didContract,
      ethereumNetwork,
      issuerAddress,
    } = await GoldfishService.getAddresses();

    dispatch(
      appActions.setAddresses({
        staking: {
          FCL: stackingFclContract,
          FCL_ETH_LP: stackingFclUniswapContract,
          enabled: stakingEnabled === "1",
        },
        erc20: {
          FCL: fclContract,
          FCL_ETH_LP: fclUniswapContract,
        },
        claimsRegistry: didContract,
        ethereumNetwork,
        issuerAddress,
      }),
    );

    // start staking details polling
    new StakingDetailsPolling().start();

    // start credentials status polling
    new CredentialsStatusPolling().start();

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
