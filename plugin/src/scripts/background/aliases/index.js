import CredentialsAliases from "./Credentials";
import StartupAliases from "./Startup";
import RequestsAliases from "./Request";

const aliases = {
  ...CredentialsAliases,
  ...StartupAliases,
  ...RequestsAliases,
};

export default aliases;
