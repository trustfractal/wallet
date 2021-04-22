import { Wallet } from "ethers";

const mnemonic = process.env["BACKEND_WALLET_MNEMONIC"];
const path = process.env["BACKEND_WALLET_PATH"];

if (!mnemonic) throw new Error("Missing BACKEND_WALLET_MNEMONIC env variable");
if (!path) throw new Error("Missing BACKEND_WALLET_PATH env variable");

const wallet = Wallet.fromMnemonic(mnemonic, path);

export default wallet;
