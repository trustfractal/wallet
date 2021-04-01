import { appTypes } from "@redux/app";
import kiltActions from "@redux/kilt";
import appActions from "@redux/app";

import KiltService from "@services/kilt";

import { getMnemonic, getIdentity } from "@redux/selectors";

export const startup = () => {
  return async (dispatch, getState) => {
    const mnemonic = getMnemonic(getState());
    const identity = getIdentity(getState());

    // register balance listener
    if (mnemonic.length > 0) {
      const onChangeBalance = (_account, balance) =>
        dispatch(kiltActions.setBalance(balance.toString()));

      await KiltService.registerBalanceListener(identity, onChangeBalance);
    }

    // set extension as launched
    dispatch(appActions.setLaunched(true));
  };
};

const Aliases = {
  [appTypes.STARTUP]: startup,
};

export default Aliases;
