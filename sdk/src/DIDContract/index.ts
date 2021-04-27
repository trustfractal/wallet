import { Contract, providers, utils as ethersUtils } from "ethers";

import Credential from "../Credential";

import ContractData from "./Contract.json";

export default class DIDContract {
  public static ABI = ContractData.abi;

  public static CONTRACT_ADDRESSES: Record<string, string> = {
    ropsten: "0x181573a13F4BF5F76F6d09D0E2a7716F6929993A",
  };

  public address: string;
  public contract: Contract;

  public constructor(
    network: string,
    {
      provider,
      providerUrl,
    }: { provider?: providers.Provider; providerUrl?: string }
  ) {
    const address = DIDContract.CONTRACT_ADDRESSES[network];

    if (!address) throw new Error(`Invalid network ${network}`);

    if (!provider && !providerUrl)
      throw new Error("Missing either provider or provider URL");

    provider = provider || new providers.JsonRpcProvider(providerUrl);

    this.address = address;
    this.contract = new Contract(address, DIDContract.ABI, provider);
  }

  public computeSignableKey({ claimerAddress, rootHash }: Credential) {
    return this.contract.computeSignableKey(claimerAddress, rootHash);
  }

  public verifyClaim({
    claimerAddress,
    attesterAddress,
    credentialSignature,
  }: Credential) {
    return this.contract.verifyClaim(
      claimerAddress,
      attesterAddress,
      credentialSignature
    );
  }

  public setClaimWithSignature({
    claimerAddress,
    attesterAddress,
    rootHash,
    credentialSignature,
  }: Credential) {
    const rootHashArray = ethersUtils.arrayify(rootHash);

    return this.contract.setClaimWithSignature(
      claimerAddress,
      attesterAddress,
      rootHashArray,
      credentialSignature
    );
  }
}
