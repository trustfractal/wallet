import protocolActions, {
  protocolTypes,
  protocolRegistrationTypes,
} from "@redux/stores/user/reducers/protocol";

import appActions from "@redux/stores/application/reducers/app";

import Wallet from "@models/Wallet";
import ProtocolService from "@services/ProtocolService";
import { DataHost } from "@services/DataHost";
import storageService from "@services/StorageService";

import { getApprovedProtocolVerificationCases } from "@redux/stores/user/reducers/credentials/selectors";
import {
  getWallet,
  getRegistrationState,
} from "@redux/stores/user/reducers/protocol/selectors";
import UserStore from "@redux/stores/user";
import ApplicationStore from "@redux/stores/application";
import { isLivenessEnabled } from "@redux/stores/application/reducers/app/selectors";

export const createWallet = () => {
  return () => {
    const existingWallet = getWallet(UserStore.getStore().getState());
    const wallet = existingWallet || Wallet.generate();

    return registerWallet(wallet);
  };
};

export const resumeWalletCreation = () => {
  return () => {
    const existingWallet = getWallet(UserStore.getStore().getState());
    const wallet = existingWallet || Wallet.generate();

    return registerWallet(wallet);
  };
};

export const importWallet = ({ payload: mnemonic }: { payload: string }) => {
  return () => {
    const wallet = Wallet.fromMnemonic(mnemonic);

    return registerWallet(wallet);
  };
};

const registerWallet = async (wallet: Wallet) => {
  // Check registration type
  const previousRegistrationState = getRegistrationState(
    UserStore.getStore().getState(),
  );

  let protocol: ProtocolService | undefined;

  if (
    previousRegistrationState === null ||
    previousRegistrationState === protocolRegistrationTypes.STARTED
  ) {
    try {
      protocol = await generateAddress(wallet);
    } catch {
      UserStore.getStore().dispatch(protocolActions.setRegistrationError(true));
      UserStore.getStore().dispatch(protocolActions.setRegistrationState(null));
      return;
    }
  }

  const livenessCheck = isLivenessEnabled(
    ApplicationStore.getStore().getState(),
  );

  if (livenessCheck) {
    // Check if has valid credentials
    const filteredVerificationCases = getApprovedProtocolVerificationCases(
      UserStore.getStore().getState(),
    );

    if (filteredVerificationCases.length === 0) {
      UserStore.getStore().dispatch(
        protocolActions.setRegistrationState(
          protocolRegistrationTypes.MISSING_CREDENTIAL,
        ),
      );
      return;
    }
  }

  try {
    await registerIdentity(wallet, protocol);
  } catch {
    UserStore.getStore().dispatch(protocolActions.setRegistrationError(true));
    UserStore.getStore().dispatch(
      protocolActions.setRegistrationState(
        protocolRegistrationTypes.ADDRESS_GENERATED,
      ),
    );
  }
};

const generateAddress = async (wallet: Wallet): Promise<ProtocolService> => {
  UserStore.getStore().dispatch(
    protocolActions.setRegistrationState(protocolRegistrationTypes.STARTED),
  );

  const protocol = await ProtocolService.create(wallet.mnemonic);
  await protocol.saveSigner(storageService);
  await DataHost.instance().enable();

  UserStore.getStore().dispatch(protocolActions.setMnemonic(wallet.mnemonic));
  UserStore.getStore().dispatch(
    protocolActions.setRegistrationState(
      protocolRegistrationTypes.ADDRESS_GENERATED,
    ),
  );

  return protocol;
};

const registerIdentity = async (wallet: Wallet, protocol?: ProtocolService) => {
  UserStore.getStore().dispatch(protocolActions.setMnemonic(wallet.mnemonic));
  UserStore.getStore().dispatch(
    protocolActions.setRegistrationState(
      protocolRegistrationTypes.ADDRESS_GENERATED,
    ),
  );

  if (!protocol) {
    protocol = await ProtocolService.create(wallet.mnemonic);
    await protocol.saveSigner(storageService);
    await DataHost.instance().enable();
  }

  await protocol.ensureIdentityRegistered();

  UserStore.getStore().dispatch(
    protocolActions.setRegistrationState(
      protocolRegistrationTypes.IDENTITY_REGISTERED,
    ),
  );

  UserStore.getStore().dispatch(
    protocolActions.setRegistrationState(
      protocolRegistrationTypes.MINTING_REGISTERED,
    ),
  );

  UserStore.getStore().dispatch(protocolActions.setRegisteredForMinting(true));

  ApplicationStore.getStore().dispatch(appActions.setWalletGenerated(true));
};

const Aliases = {
  [protocolTypes.CREATE_WALLET]: createWallet,
  [protocolTypes.RESUME_WALLET_CREATION]: resumeWalletCreation,
  [protocolTypes.IMPORT_WALLET]: importWallet,
};

export default Aliases;
