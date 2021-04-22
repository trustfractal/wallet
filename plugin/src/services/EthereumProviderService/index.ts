import detectEthereumProvider from "@metamask/detect-provider";
import {
  Contract,
  providers as ethersProviders,
  utils as ethersUtils,
} from "ethers";

import TokenTypes from "@models/Token/types";
import Credential from "@models/Credential";
import {
  ERROR_PROVIDER_NOT_DETECTED,
  ERROR_PROVIDER_NOT_METAMASK,
  ERROR_PROVIDER_OVERRIDE,
  ERROR_PROVIDER_NOT_INITIALIZED,
} from "@services/EthereumProviderService/Errors";

import ContractsAddresses from "@contracts/addresses.json";
import ClaimsRegistry from "@contracts/ClaimsRegistry.json";
import Staking from "@contracts/Staking.json";
import ERC20 from "@contracts/ERC20.json";

class EthereumProviderService {
  private static instance: EthereumProviderService;
  private web3Provider?: ethersProviders.Web3Provider;

  public static getInstance(): EthereumProviderService {
    if (!EthereumProviderService.instance) {
      EthereumProviderService.instance = new EthereumProviderService();
    }

    return EthereumProviderService.instance;
  }

  public async init(): Promise<ethersProviders.Web3Provider> {
    // detect the browser ethereum provider
    const provider = await detectEthereumProvider();

    if (!provider) {
      throw ERROR_PROVIDER_NOT_DETECTED();
    }

    if (provider !== window.ethereum) {
      throw ERROR_PROVIDER_OVERRIDE();
    }

    if (!window.ethereum?.isMetaMask) {
      throw ERROR_PROVIDER_NOT_METAMASK();
    }

    this.web3Provider = new ethersProviders.Web3Provider(window.ethereum);

    return this.web3Provider;
  }

  public isAvailable() {
    return this.web3Provider !== undefined;
  }

  private ensureProviderIsInitialized() {
    if (!this.isAvailable()) {
      throw ERROR_PROVIDER_NOT_INITIALIZED();
    }
  }

  public async getAccountAddress() {
    this.ensureProviderIsInitialized();

    const accounts = await this.web3Provider!.provider.request!({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      return;
    }

    return accounts[0];
  }

  public async credentialStore(address: string, serializedCredential: string) {
    try {
      // prepare data
      const parsedCredential = Credential.parse(serializedCredential);
      const rootHashByteArray = ethersUtils.arrayify(parsedCredential.rootHash);
      const signer = this.web3Provider!.getSigner(address);

      // init smart contract
      const claimsRegistryContract = new Contract(
        ContractsAddresses.CLAIMS_REGISTRY,
        ClaimsRegistry.abi,
        signer,
      );

      // store the credential on-chain
      const storingResult = await claimsRegistryContract.setClaimWithSignature(
        parsedCredential.claimerAddress,
        parsedCredential.attesterAddress,
        rootHashByteArray,
        parsedCredential.attesterSignature,
      );

      // add transaction hash to the credential
      parsedCredential.transactionHash = storingResult.hash;

      return parsedCredential.serialize();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async stake(
    address: string,
    amount: string,
    token: TokenTypes,
    serializedCredential: string,
  ) {
    // prepare data
    const parsedCredential = Credential.parse(serializedCredential);
    const signer = this.web3Provider!.getSigner(address);
    const etherAmount = ethersUtils.parseEther(amount);

    // init smart contract
    const tokenContract = new Contract(
      ContractsAddresses.ERC_20[token],
      ERC20.abi,
      signer,
    );
    const stakingContract = new Contract(
      ContractsAddresses.STAKING[token],
      Staking.abi,
      signer,
    );

    // pre-approve stake for the address
    await tokenContract.approve(ContractsAddresses.STAKING[token], etherAmount);

    // stake amount
    const stakingResult = await stakingContract.stake(
      etherAmount,
      parsedCredential.attesterSignature,
    );

    return stakingResult.hash;
  }

  public async withdraw(address: string, token: TokenTypes) {
    // prepare data
    const signer = this.web3Provider!.getSigner(address);

    // init smart contract
    const stakingContract = new Contract(
      ContractsAddresses.STAKING[token],
      Staking.abi,
      signer,
    );

    // withdraw from pool
    const withdrawResult = await stakingContract.withdraw();

    return withdrawResult.hash;
  }
}

const ethereumProvider: EthereumProviderService = EthereumProviderService.getInstance();

export default ethereumProvider;
