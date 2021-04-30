import { BigNumber } from "ethers";

import { IStakingDetails, ISerializable } from "@fractalwallet/types";

import StakingStatus from "./status";

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
  public status?: StakingStatus;

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
    status?: StakingStatus,
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
    this.status = status;
  }

  public serialize(): string {
    return JSON.stringify({
      userBalance: this.userBalance.toJSON(),
      userStakedAmount: this.userStakedAmount.toJSON(),
      userCurrentReward: this.userCurrentReward.toJSON(),
      userMaxReward: this.userMaxReward.toJSON(),
      poolAvailableTokens: this.poolAvailableTokens.toJSON(),
      poolTotalTokens: this.poolTotalTokens.toJSON(),
      stakingAllowedAmount: this.stakingAllowedAmount.toJSON(),
      stakingMinimumStake: this.stakingMinimumStake.toJSON(),
      stakingMaximumStake: this.stakingMaximumStake.toJSON(),
      stakingEndDate: this.stakingEndDate.toJSON(),
      stakingStartDate: this.stakingStartDate.toJSON(),
      stakingAPY: this.stakingAPY.toJSON(),
      stakingCurrentExpectedRewardRate: this.stakingCurrentExpectedRewardRate.toJSON(),
      status: this.status,
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
      status,
    } = JSON.parse(str);

    return new StakingDetails(
      BigNumber.from(userBalance),
      BigNumber.from(userStakedAmount),
      BigNumber.from(userCurrentReward),
      BigNumber.from(userMaxReward),
      BigNumber.from(poolAvailableTokens),
      BigNumber.from(poolTotalTokens),
      BigNumber.from(stakingAllowedAmount),
      BigNumber.from(stakingMinimumStake),
      BigNumber.from(stakingMaximumStake),
      BigNumber.from(stakingEndDate),
      BigNumber.from(stakingStartDate),
      BigNumber.from(stakingAPY),
      BigNumber.from(stakingCurrentExpectedRewardRate),
      status,
    );
  }
}
