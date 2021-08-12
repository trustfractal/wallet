import { Dispatch } from "react";
import { AnyAction } from "redux";

import protocolActions, {
  protocolTypes,
  protocolRegistrationTypes,
} from "@redux/stores/user/reducers/protocol";

import Wallet from "@models/Wallet";
import MaguroService from "@services/MaguroService";
import ProtocolService from "@services/ProtocolService";
import { DataHost } from "@services/DataHost";

export const createWallet = () => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(
      protocolActions.setRegistrationState(protocolRegistrationTypes.STARTED),
    );
    await DataHost.instance().enable();

    const wallet = Wallet.generate();
    const protocol = await ProtocolService.create(wallet!.mnemonic);

    try {
      dispatch(protocolActions.setMnemonic(wallet.mnemonic));
      dispatch(
        protocolActions.setRegistrationState(
          protocolRegistrationTypes.ADDRESS_GENERATED,
        ),
      );

      await MaguroService.registerIdentity(wallet.address);

      dispatch(
        protocolActions.setRegistrationState(
          protocolRegistrationTypes.IDENTITY_REGISTERED,
        ),
      );

      // TODO(frm): Calculate proof
      const proof =
        "0x4004021ced8799296ceca557832ab941a50b4a11f83478cf141f51f933f653ab9fbcc05a037cddbed06e309bf334942c4e58cdf1a46e237911ccd7fcf9787cbc7fd0";

      await protocol.registerForMinting(proof);

      dispatch(
        protocolActions.setRegistrationState(
          protocolRegistrationTypes.COMPLETED,
        ),
      );
      dispatch(protocolActions.setRegisteredForMinting(true));
    } catch {
      dispatch(protocolActions.setRegistrationError(true));
    }
  };
};

const Aliases = {
  [protocolTypes.CREATE_WALLET]: createWallet,
};

export default Aliases;
