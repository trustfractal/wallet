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
    const dataHost = DataHost.instance();
    await dataHost.enable();

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

      const extensionProof = await dataHost.extensionProof();
      if (extensionProof == null) return;
      const [length, proof] = extensionProof;
      await protocol.registerForMinting(proof);
      await dataHost.setLastProofLength(length);

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
