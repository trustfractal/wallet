import { Contract, providers as ethersProviders } from "ethers";

import {
  Erc20 as IERC20,
  Staking as IStaking,
  ClaimsRegistry as IClaimsRegistry,
  Callback,
  IRPCProviderService,
} from "@fractalwallet/types";

import { ERROR_PROVIDER_NOT_INITIALIZED } from "@services/EthereumProviderService/Errors";

import StakingDetails from "@models/Staking/StakingDetails";
import Credential from "@models/Credential";

import ClaimsRegistry from "@contracts/ClaimsRegistry.json";
import Staking from "@contracts/Staking.json";
import ERC20 from "@contracts/ERC20.json";

class RPCProviderService implements IRPCProviderService {
  private static instance: RPCProviderService;
  private rpcProvider?: ethersProviders.JsonRpcProvider;

  public static getInstance(): RPCProviderService {
    if (!RPCProviderService.instance) {
      RPCProviderService.instance = new RPCProviderService();
    }

    return RPCProviderService.instance;
  }

  public async init(
    providerUrl: string,
    network: string,
  ): Promise<ethersProviders.JsonRpcProvider> {
    this.rpcProvider = new ethersProviders.JsonRpcProvider(
      providerUrl,
      network,
    );

    return this.rpcProvider;
  }

  public isAvailable(): boolean {
    return this.rpcProvider !== undefined;
  }

  private ensureProviderIsInitialized(): void {
    if (!this.isAvailable()) {
      throw ERROR_PROVIDER_NOT_INITIALIZED();
    }
  }

  public async waitForTransaction(
    transactionHash: string,
    callback: Callback,
  ): Promise<void> {
    try {
      this.ensureProviderIsInitialized();

      const receipt = await this.rpcProvider!.waitForTransaction(
        transactionHash,
      );

      // resolve with transaction status
      callback(receipt.status === undefined || receipt.status === 1);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async fetchStakingDetails(
    address: string,
    tokenContractAddress: string,
    stakingTokenContractAddress: string,
  ): Promise<StakingDetails> {
    try {
      // init smart contract
      const tokenContract = new Contract(
        tokenContractAddress,
        ERC20.abi,
        this.rpcProvider!,
      ) as IERC20;
      const stakingContract = new Contract(
        stakingTokenContractAddress,
        Staking.abi,
        this.rpcProvider!,
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
        stakingTokenContractAddress,
      );
      const stakingStartDate = await stakingContract.startDate();
      const stakingEndDate = await stakingContract.endDate();
      const stakingMinAmount = await stakingContract.minAmount();
      const stakingMaxAmount = await stakingContract.maxAmount();
      const currentAPY = await stakingContract.currentAPY();
      const currentExpectedRewardRate = await stakingContract.calculateReward(
        Math.floor(Date.now() / 1000),
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

      return details;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async fetchCredentialValidity(
    serializedCredential: string,
    claimsRegistryContractAddress: string,
  ): Promise<boolean> {
    try {
      // prepare data
      const parsedCredential = Credential.parse(serializedCredential);

      // init smart contract
      const claimsRegistryContract = new Contract(
        claimsRegistryContractAddress,
        ClaimsRegistry.abi,
        this.rpcProvider!,
      ) as IClaimsRegistry;

      // verify claim
      const verifyClaim = await claimsRegistryContract.verifyClaim(
        parsedCredential.claimerAddress,
        parsedCredential.attesterAddress as string,
        parsedCredential.attestedClaimSignature as string,
      );

      return verifyClaim;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const rpcProviderService: RPCProviderService = RPCProviderService.getInstance();

export default rpcProviderService;
