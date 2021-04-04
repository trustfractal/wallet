import ExtensionConnection from "@models/Connection/ExtensionConnection";
import { extension } from "@models/Connection/params";
import types from "@models/Connection/types";

const stream = new ExtensionConnection(extension);

const confirmCredential = (...args) =>
  stream.invoke(types.CONFIRM_CREDENTIAL, ...args);
const verifyConnection = (...args) =>
  stream.invoke(types.VERIFY_CONNECTION, ...args);

const Fractal = {
  confirmCredential,
  verifyConnection,
};

export default Fractal;
