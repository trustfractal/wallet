import { Dispatch } from "react";
import { AnyAction } from "redux";

import protocolActions, {
  protocolTypes,
} from "@redux/stores/user/reducers/protocol";

import Wallet from "@models/Wallet";
import MaguroService from "@services/MaguroService";
import ProtocolService from "@services/ProtocolService";

export const createWallet = () => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const wallet = Wallet.generate();
    const protocol = await ProtocolService.create(wallet!.mnemonic);

    try {
      await MaguroService.registerIdentity(wallet.address);

      // TODO(frm): Calculate proof
      const proof =
        "0x4004021ced8799296ceca557832ab941a50b4a11f83478cf141f51f933f653ab9fbcc05a037cddbed06e309bf334942c4e58cdf1a46e237911ccd7fcf9787cbc7fd0";

      await protocol.registerForMinting(proof);

      dispatch(protocolActions.setMnemonic(wallet.mnemonic));
      dispatch(protocolActions.setRegisteredForMinting(true));
      dispatch(protocolActions.setRegistrationSuccess(true));
    } catch {
      dispatch(protocolActions.setRegistrationSuccess(false));
      console.error("Something went wrong registering the identity");
    }
  };
};

const Aliases = {
  [protocolTypes.CREATE_WALLET]: createWallet,
};

export default Aliases;
