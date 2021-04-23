import { BigNumber } from "ethers";

import { ISerializable } from "./Common";

export interface IStakingDetails extends ISerializable {
  userBalance: BigNumber;
  userStakedAmount: BigNumber;
  userCurrentReward: BigNumber;
  userMaxReward: BigNumber;
  poolAvailableTokens: BigNumber;
  poolTotalTokens: BigNumber;
  stakingAllowedAmount: BigNumber;
  stakingMinimumStake: BigNumber;
  stakingMaximumStake: BigNumber;
  stakingEndDate: BigNumber;
  stakingStartDate: BigNumber;
  stakingAPY: BigNumber;
  stakingCurrentExpectedRewardRate: BigNumber;
}
