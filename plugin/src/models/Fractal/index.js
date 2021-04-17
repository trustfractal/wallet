import ExtensionConnection from "@models/Connection/ExtensionConnection";
import { extension } from "@models/Connection/params";
import types from "@models/Connection/types";

const extensionConnection = new ExtensionConnection(extension);

const confirmCredential = (...args) =>
  extensionConnection.invoke(types.CONFIRM_CREDENTIAL, args);
const verifyConnection = (...args) =>
  extensionConnection.invoke(types.VERIFY_CONNECTION, args);

extensionConnection.on(types.COMMIT_CREDENTIAL, async ([credential]) => {
  console.log("Commiting the credential", credential);

  // Dummy wait for simulating credential transaction commit
  await new Promise((resolve) => setTimeout(() => resolve(), 3000));

  const transactionHash =
    "0x9ed9d53fddb685493ef99f4ce622f15573966dbb6031ff55a828b76445cdb7ba";

  return transactionHash;
});

const Fractal = {
  confirmCredential,
  verifyConnection,
};

export default Fractal;
