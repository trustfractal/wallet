import ExtensionConnection from "@models/Connection/ExtensionConnection";
import { extension_attester } from "@models/Connection/params";

const stream = new ExtensionConnection(extension_attester);

const broadcastCredential = (...args) =>
  stream.invoke("broadcastCredential", ...args);

const getPublicIdentity = () => stream.invoke("getPublicIdentity");

const getProperties = (...args) => stream.invoke("getProperties", ...args);

const requestAttestation = (...args) =>
  stream.invoke("requestAttestation", ...args);

const verifyConnection = () => stream.invoke("verifyConnection");

const Attester = {
  broadcastCredential,
  getPublicIdentity,
  getProperties,
  requestAttestation,
  verifyConnection,
};

export default Attester;
