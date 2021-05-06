import appActions, { appTypes } from "@redux/stores/application/reducers/app";

import GoldfishService from "@services/GoldfishService";

import StakingDetailsPolling from "@models/Polling/StakingDetailsPolling";
import CredentialsValidityPolling from "@models/Polling/CredentialsValidityPolling";

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
          FCL: fclContract,
          FCL_ETH_LP: fclUniswapContract,
          enabled: stakingEnabled === "1",
        },
        erc20: {
          FCL: stackingFclContract,
          FCL_ETH_LP: stackingFclUniswapContract,
        },
        claimsRegistry: didContract,
        ethereumNetwork,
        issuerAddress,
      }),
    );

    // start staking details polling
    new StakingDetailsPolling().start();

    // start credentials validity polling
    new CredentialsValidityPolling().start();

    dispatch(appActions.setLaunched(true));
  };
};

const Aliases = {
  [appTypes.STARTUP]: startup,
};

export default Aliases;
