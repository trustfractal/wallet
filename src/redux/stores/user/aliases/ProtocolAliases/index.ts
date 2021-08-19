import { Dispatch } from "react";
import { AnyAction } from "redux";

import protocolActions, {
  protocolTypes,
  protocolRegistrationTypes,
} from "@redux/stores/user/reducers/protocol";

import Wallet from "@models/Wallet";
import ProtocolService from "@services/ProtocolService";
import { DataHost } from "@services/DataHost";
import storageService from "@services/StorageService";

import { getWallet } from "@redux/stores/user/reducers/protocol/selectors";
import UserStore from "@redux/stores/user";

export const createWallet = () => {
  return async (dispatch: Dispatch<AnyAction>) => {
    dispatch(
      protocolActions.setRegistrationState(protocolRegistrationTypes.STARTED),
    );

    const existingWallet = getWallet(UserStore.getStore().getState());
    const wallet = existingWallet || Wallet.generate();

    const protocol = await ProtocolService.create(wallet!.mnemonic);
    await protocol.saveSigner(storageService);
    await DataHost.instance().enable();

    try {
      dispatch(protocolActions.setMnemonic(wallet.mnemonic));
      dispatch(
        protocolActions.setRegistrationState(
          protocolRegistrationTypes.ADDRESS_GENERATED,
        ),
      );

      await protocol.ensureIdentityRegistered();

      dispatch(
        protocolActions.setRegistrationState(
          protocolRegistrationTypes.IDENTITY_REGISTERED,
        ),
      );

      dispatch(
        protocolActions.setRegistrationState(
          protocolRegistrationTypes.MINTING_REGISTERED,
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
