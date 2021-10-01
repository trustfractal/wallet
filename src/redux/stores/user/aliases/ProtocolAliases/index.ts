import Wallet from "@models/Wallet";
import ApplicationStore from "@redux/stores/application";
import appActions from "@redux/stores/application/reducers/app";
import { isLivenessEnabled } from "@redux/stores/application/reducers/app/selectors";
import UserStore from "@redux/stores/user";
import { getApprovedProtocolVerificationCases } from "@redux/stores/user/reducers/credentials/selectors";
import protocolActions, {
  protocolRegistrationTypes,
  protocolTypes,
} from "@redux/stores/user/reducers/protocol";
import {
  getRegistrationState,
  getWallet,
} from "@redux/stores/user/reducers/protocol/selectors";
import {
  getDataHost,
  getProtocolService,
  getStorageService,
} from "@services/Factory";
import { ProtocolService } from "@services/ProtocolService";

const createWallet = () => {
  return () => {
    const existingWallet = getWallet(UserStore.getStore().getState());
    const wallet = existingWallet || Wallet.generate();

    return registerWallet(wallet);
  };
};

const resumeWalletCreation = () => {
  return () => {
    const existingWallet = getWallet(UserStore.getStore().getState());
    const wallet = existingWallet || Wallet.generate();

    return registerWallet(wallet);
  };
};

const importWallet = ({ payload: mnemonic }: { payload: string }) => {
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
      await generateAddress(wallet);
      protocol = await getProtocolService();
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

const generateAddress = async (wallet: Wallet) => {
  UserStore.getStore().dispatch(
    protocolActions.setRegistrationState(protocolRegistrationTypes.STARTED),
  );

  await ProtocolService.saveSignerMnemonic(
    getStorageService(),
    wallet.mnemonic,
  );
  await getDataHost().enable();

  UserStore.getStore().dispatch(protocolActions.setMnemonic(wallet.mnemonic));
  UserStore.getStore().dispatch(
    protocolActions.setRegistrationState(
      protocolRegistrationTypes.ADDRESS_GENERATED,
    ),
  );
};

const registerIdentity = async (wallet: Wallet, protocol?: ProtocolService) => {
  UserStore.getStore().dispatch(protocolActions.setMnemonic(wallet.mnemonic));
  UserStore.getStore().dispatch(
    protocolActions.setRegistrationState(
      protocolRegistrationTypes.ADDRESS_GENERATED,
    ),
  );

  if (!protocol) {
    protocol = await getProtocolService(wallet.mnemonic);
    await protocol.saveSigner(getStorageService());
    await getDataHost().enable();
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
