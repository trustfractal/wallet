import { Wallet } from "ethers";

const mnemonic = process.env["WALLET_MNEMONIC"];

if (!mnemonic) throw new Error("Missing WALLET_MNEMONIC env variable");

const wallet = Wallet.fromMnemonic(mnemonic);

export default wallet;
