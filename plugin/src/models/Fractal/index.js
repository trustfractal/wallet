import ExtensionConnection from "@models/Connection/ExtensionConnection";
import { extension } from "@models/Connection/params";

const stream = new ExtensionConnection(extension);

const verifyConnection = () => stream.invoke("verifyConnection");
const requestCredential = (...args) =>
  stream.invoke("requestCredential", ...args);

const Fractal = {
  verifyConnection,
  requestCredential,
};

export default Fractal;
