import CredentialsAliases from "./CredentialsAliases";
import ProtocolAliases from "./ProtocolAliases";
import RequestsAliases from "./RequestsAliases";

const aliases = {
  ...CredentialsAliases,
  ...RequestsAliases,
  ...ProtocolAliases,
};

export default aliases;
