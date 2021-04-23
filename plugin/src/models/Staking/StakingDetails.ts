import { BigNumber } from "ethers";

import { IStakingDetails, ISerializable } from "@fractalwallet/types";

export default class StakingDetails implements IStakingDetails, ISerializable {
  public userBalance: BigNumber;
  public userStakedAmount: BigNumber;
  public userCurrentReward: BigNumber;
  public userMaxReward: BigNumber;
  public poolAvailableTokens: BigNumber;
  public poolTotalTokens: BigNumber;
  public stakingAllowedAmount: BigNumber;
  public stakingMinimumStake: BigNumber;
  public stakingMaximumStake: BigNumber;
  public stakingEndDate: BigNumber;
  public stakingStartDate: BigNumber;
  public stakingAPY: BigNumber;
  public stakingCurrentExpectedRewardRate: BigNumber;

  public constructor(
    userBalance: BigNumber,
    userStakedAmount: BigNumber,
    userCurrentReward: BigNumber,
    userMaxReward: BigNumber,
    poolAvailableTokens: BigNumber,
    poolTotalTokens: BigNumber,
    stakingAllowedAmount: BigNumber,
    stakingMinimumStake: BigNumber,
    stakingMaximumStake: BigNumber,
    stakingEndDate: BigNumber,
    stakingStartDate: BigNumber,
    stakingAPY: BigNumber,
    stakingCurrentExpectedRewardRate: BigNumber,
  ) {
    this.userBalance = userBalance;
    this.userStakedAmount = userStakedAmount;
    this.userCurrentReward = userCurrentReward;
    this.userMaxReward = userMaxReward;
    this.poolAvailableTokens = poolAvailableTokens;
    this.poolTotalTokens = poolTotalTokens;
    this.stakingAllowedAmount = stakingAllowedAmount;
    this.stakingMinimumStake = stakingMinimumStake;
    this.stakingMaximumStake = stakingMaximumStake;
    this.stakingEndDate = stakingEndDate;
    this.stakingStartDate = stakingStartDate;
    this.stakingAPY = stakingAPY;
    this.stakingCurrentExpectedRewardRate = stakingCurrentExpectedRewardRate;
  }

  public serialize(): string {
    return JSON.stringify({
      userBalance: this.userBalance,
      userStakedAmount: this.userStakedAmount,
      userCurrentReward: this.userCurrentReward,
      userMaxReward: this.userMaxReward,
      poolAvailableTokens: this.poolAvailableTokens,
      poolTotalTokens: this.poolTotalTokens,
      stakingAllowedAmount: this.stakingAllowedAmount,
      stakingMinimumStake: this.stakingMinimumStake,
      stakingMaximumStake: this.stakingMaximumStake,
      stakingEndDate: this.stakingEndDate,
      stakingStartDate: this.stakingStartDate,
      stakingAPY: this.stakingAPY,
      stakingCurrentExpectedRewardRate: this.stakingCurrentExpectedRewardRate,
    });
  }

  public static parse(str: string): StakingDetails {
    const {
      userBalance,
      userStakedAmount,
      userCurrentReward,
      userMaxReward,
      poolAvailableTokens,
      poolTotalTokens,
      stakingAllowedAmount,
      stakingMinimumStake,
      stakingMaximumStake,
      stakingEndDate,
      stakingStartDate,
      stakingAPY,
      stakingCurrentExpectedRewardRate,
    } = JSON.parse(str);

    return new StakingDetails(
      userBalance,
      userStakedAmount,
      userCurrentReward,
      userMaxReward,
      poolAvailableTokens,
      poolTotalTokens,
      stakingAllowedAmount,
      stakingMinimumStake,
      stakingMaximumStake,
      stakingEndDate,
      stakingStartDate,
      stakingAPY,
      stakingCurrentExpectedRewardRate,
    );
  }
}
