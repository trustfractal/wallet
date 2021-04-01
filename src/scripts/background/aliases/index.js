import StartupAliases from "./Startup";
import KiltAliases from "./Kilt";
import DataAliases from "./Data";
import RequestsAliases from "./Request";

const aliases = {
  ...StartupAliases,
  ...KiltAliases,
  ...DataAliases,
  ...RequestsAliases,
};

export default aliases;
