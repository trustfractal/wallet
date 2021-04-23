import detectEthereumProvider from "@metamask/detect-provider";
import {
  BigNumberish,
  Contract,
  providers as ethersProviders,
  utils as ethersUtils,
} from "ethers";

import {
  Erc20 as IERC20,
  Staking as IStaking,
  ClaimsRegistry as IClaimsRegistry,
  IEthereumProviderService,
} from "@fractalwallet/types";
import StakingDetails from "@models/Staking/StakingDetails";
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

class EthereumProviderService implements IEthereumProviderService {
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

  public isAvailable(): boolean {
    return this.web3Provider !== undefined;
  }

  private ensureProviderIsInitialized(): void {
    if (!this.isAvailable()) {
      throw ERROR_PROVIDER_NOT_INITIALIZED();
    }
  }

  public async getAccountAddress(): Promise<string | undefined> {
    this.ensureProviderIsInitialized();

    const accounts = await this.web3Provider!.provider.request!({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      return;
    }

    return accounts[0];
  }

  public async credentialStore(
    address: string,
    serializedCredential: string,
  ): Promise<string> {
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
      ) as IClaimsRegistry;

      // store the credential on-chain
      const storingResult = await claimsRegistryContract.setClaimWithSignature(
        parsedCredential.claimerAddress,
        parsedCredential.attesterAddress as string,
        rootHashByteArray,
        parsedCredential.attesterSignature as string,
      );

      // add transaction hash to the credential
      parsedCredential.transactionHash = storingResult.hash;

      return parsedCredential.serialize();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async isCredentialValid(
    address: string,
    serializedCredential: string,
  ): Promise<boolean> {
    try {
      // prepare data
      const parsedCredential = Credential.parse(serializedCredential);
      const signer = this.web3Provider!.getSigner(address);

      // init smart contract
      const claimsRegistryContract = new Contract(
        ContractsAddresses.CLAIMS_REGISTRY,
        ClaimsRegistry.abi,
        signer,
      ) as IClaimsRegistry;

      // verify claim
      const verifyClaim = await claimsRegistryContract.verifyClaim(
        parsedCredential.claimerAddress,
        parsedCredential.attesterAddress as string,
        parsedCredential.attesterSignature as string,
      );

      return verifyClaim;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getStakingDetails(
    address: string,
    token: TokenTypes,
  ): Promise<string> {
    try {
      // prepare data
      const signer = this.web3Provider!.getSigner(address);

      // init smart contract
      const tokenContract = new Contract(
        ContractsAddresses.ERC_20[token],
        ERC20.abi,
        signer,
      ) as IERC20;
      const stakingContract = new Contract(
        ContractsAddresses.STAKING[token],
        Staking.abi,
        signer,
      ) as IStaking;

      // get user balance, current stake, current rewards and expected rewards
      const balance = await tokenContract.balanceOf(address);
      const stakedAmount = await stakingContract.getStakedAmount(address);
      const currentReward = await stakingContract.getCurrentReward(address);
      const maxReward = await stakingContract.getMaxStakeReward(address);

      // get liquidity pool details
      const poolTotalTokens = await stakingContract.totalPool();
      const poolAvailableTokens = await stakingContract.availablePool();

      // get staking details
      const stakingAllowedAmount = await tokenContract.allowance(
        address,
        ContractsAddresses.STAKING[token],
      );
      const stakingStartDate = await stakingContract.startDate();
      const stakingEndDate = await stakingContract.endDate();
      const stakingMinAmount = await stakingContract.minAmount();
      const stakingMaxAmount = await stakingContract.maxAmount();
      const currentAPY = await stakingContract.currentAPY();
      const currentExpectedRewardRate = await stakingContract.calculateReward(
        Date.now(),
        stakingEndDate,
        100,
      );

      const details = new StakingDetails(
        balance,
        stakedAmount,
        currentReward,
        maxReward,
        poolAvailableTokens,
        poolTotalTokens,
        stakingAllowedAmount,
        stakingMinAmount,
        stakingMaxAmount,
        stakingStartDate,
        stakingEndDate,
        currentAPY,
        currentExpectedRewardRate,
      );

      return details.serialize();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async approveStake(
    address: string,
    amount: string,
    token: TokenTypes,
  ): Promise<string | undefined> {
    // prepare data
    const signer = this.web3Provider!.getSigner(address);
    const etherAmount = ethersUtils.parseEther(amount) as BigNumberish;

    // init smart contract
    const tokenContract = new Contract(
      ContractsAddresses.ERC_20[token],
      ERC20.abi,
      signer,
    ) as IERC20;

    // check if approve is needed
    const allowanceValue = await tokenContract.allowance(
      address,
      ContractsAddresses.STAKING[token],
    );

    if (allowanceValue.lt(etherAmount)) {
      // pre-approve stake for the address
      const approveResult = await tokenContract.approve(
        ContractsAddresses.STAKING[token],
        etherAmount,
      );

      return approveResult.hash;
    }
  }

  public async stake(
    address: string,
    amount: string,
    token: TokenTypes,
    serializedCredential: string,
  ): Promise<string> {
    // prepare data
    const parsedCredential = Credential.parse(serializedCredential);
    const signer = this.web3Provider!.getSigner(address);
    const etherAmount = ethersUtils.parseEther(amount) as BigNumberish;

    // init smart contract
    const tokenContract = new Contract(
      ContractsAddresses.ERC_20[token],
      ERC20.abi,
      signer,
    ) as IERC20;
    const stakingContract = new Contract(
      ContractsAddresses.STAKING[token],
      Staking.abi,
      signer,
    ) as IStaking;

    // check if approve is needed
    const allowanceValue = await tokenContract.allowance(
      address,
      ContractsAddresses.STAKING[token],
    );

    if (allowanceValue.lt(etherAmount)) {
      // pre-approve stake for the address
      const approveResult = await tokenContract.approve(
        ContractsAddresses.STAKING[token],
        etherAmount,
      );

      return approveResult.hash;
    }

    // stake amount
    const stakingResult = await stakingContract.stake(
      etherAmount,
      parsedCredential.attesterSignature as string,
    );

    return stakingResult.hash;
  }

  public async withdraw(address: string, token: TokenTypes): Promise<string> {
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
