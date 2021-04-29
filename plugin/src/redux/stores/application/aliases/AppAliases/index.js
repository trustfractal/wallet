import appActions, { appTypes } from "@redux/stores/application/reducers/app";

import GoldfishService from "@services/GoldfishService";

export const startup = () => {
  return async (dispatch) => {
    const {
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
    dispatch(appActions.setLaunched(true));
  };
};

const Aliases = {
  [appTypes.STARTUP]: startup,
};

export default Aliases;
