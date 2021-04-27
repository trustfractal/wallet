import { Wallet } from "ethers";
import { getEnv } from "../utils";

const mnemonic = getEnv("BACKEND_WALLET_MNEMONIC");
const path = getEnv("BACKEND_WALLET_PATH");

const wallet = Wallet.fromMnemonic(mnemonic, path);

export default wallet;
