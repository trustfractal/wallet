import styled, { css } from "styled-components";
import moment from "moment";

import Text, {
  TextSizes,
  TextHeights,
  TextWeights,
} from "@popup/components/common/Text";
import Button from "@popup/components/common/Button";
import Icon, { IconNames } from "@popup/components/common/Icon";
import TopComponent from "@popup/components/common/TopComponent";

import StakingDetails from "@models/Staking/StakingDetails";
import TokenTypes from "@models/Token/types";

import StakingStatus from "@models/Staking/status";
import {
  getPercentage,
  parseAndFormatEther,
  parseEther,
} from "@utils/FormatUtils";

const DateLabelContainer = styled.div`
  opacity: 0.6;
  margin-bottom: var(--s-12);
  text-transform: uppercase;
`;

const DateContainer = styled.div`
  margin-bottom: var(--s-20);
`;

const PoolRoot = styled.div`
  color: var(--c-dark-blue);

  margin-bottom: var(--s-32);
  background: var(--c-white);
  border-radius: var(--s-12);

  box-shadow: 0px 8px 12px #061a3a;
  border: 1px solid rgba(19, 44, 83, 0.2);
`;

const PoolHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  border-top-right-radius: var(--s-12);
  border-top-left-radius: var(--s-12);

  padding: var(--s-16) var(--s-10);
  border-bottom: 1px solid var(--c-gray);

  background-color: white;
`;

const PoolTitle = styled.div`
  display: flex;
  flex-direction: row;
  display: flex;
  align-items: center;
`;

const PoolBody = styled.div<{ filled?: boolean }>`
  border-bottom-right-radius: var(--s-12);
  border-bottom-left-radius: var(--s-12);

  padding: var(--s-12) var(--s-10);

  ${(props) =>
    props.filled &&
    css`
      background: var(--c-lightest-orange);
    `}
`;

const IconContainer = styled.div`
  width: 40px;
  margin-right: var(--s-10);
`;

const PoolInfoContainer = styled.div`
  display: flex;
  margin-bottom: var(--s-32);
`;

const PoolInfoPercentageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--s-32);
`;

const PoolLeftInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const PoolRightInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const InfoLabel = styled.div`
  opacity: 0.6;
  margin-bottom: var(--s-8);
  text-transform: uppercase;
`;

const StakeLabel = styled.div`
  color: var(--c-orange);
  margin-bottom: var(--s-12);
  text-transform: uppercase;
`;

const StakeAmountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StakeAmount = styled.div`
  margin-right: var(--s-8);
`;

const RewardLabel = styled.div`
  margin-bottom: var(--s-8);
  text-transform: uppercase;
`;

const RewardAmountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RewardAmount = styled.div`
  margin-right: var(--s-8);
`;

const ProgressRoot = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: var(--s-4);
  background-color: var(--c-light-orange);
  height: var(--s-12);
  width: 100%;
  margin-bottom: var(--s-4);
`;

const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(${({ progress }) => progress});
  transform-origin: left;
  background-color: var(--c-orange);
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export type StakingProps = {
  onClick: () => void;
  stakingDetails: {
    [TokenTypes.FCL]: StakingDetails;
    [TokenTypes.FCL_ETH_LP]: StakingDetails;
  };
  stakingStatus: {
    [TokenTypes.FCL]: StakingStatus;
    [TokenTypes.FCL_ETH_LP]: StakingStatus;
  };
};

export type PoolProps = {
  id: number;
  startDate: string;
  endDate: string;
  token: string;
  apy: string;
  currentExpectedRewardRate: string;
  usedTokens: string;
  totalTokens: string;
  currentReward: string;
  maxReward: string;
  stakedAmount: string;
  withdrawAmount: string;
  percentage: number;
  state: StakingStatus;
  icon: IconNames;
  onClick: () => void;
};

function StakePool(props: PoolProps) {
  const {
    token,
    apy,
    currentExpectedRewardRate,
    usedTokens,
    totalTokens,
    percentage,
    icon,
    onClick,
  } = props;

  return (
    <PoolRoot>
      <PoolHeader>
        <PoolTitle>
          <IconContainer>
            <Icon name={icon} />
          </IconContainer>
          <Text weight={TextWeights.SEMIBOLD}>{token}</Text>
        </PoolTitle>
      </PoolHeader>
      <PoolBody>
        <PoolInfoContainer>
          <PoolLeftInfo>
            <InfoLabel>
              <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                Current APY
              </Text>
            </InfoLabel>
            <Text
              size={TextSizes.SMALL}
              height={TextHeights.SMALL}
              weight={TextWeights.SEMIBOLD}
            >
              {apy}
            </Text>
          </PoolLeftInfo>
          <PoolRightInfo>
            <InfoLabel>
              <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                Expected Reward
              </Text>
            </InfoLabel>
            <Text
              size={TextSizes.SMALL}
              height={TextHeights.SMALL}
              weight={TextWeights.SEMIBOLD}
            >
              {currentExpectedRewardRate}
            </Text>
          </PoolRightInfo>
        </PoolInfoContainer>
        <PoolInfoPercentageContainer>
          <InfoLabel>
            <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
              Liquidity
            </Text>
          </InfoLabel>
          <ProgressRoot>
            <ProgressBar progress={percentage / 100} />
          </ProgressRoot>
          <PoolInfoContainer>
            <PoolLeftInfo>
              <Text
                size={TextSizes.SMALL}
                height={TextHeights.SMALL}
                weight={TextWeights.BOLD}
              >
                {percentage} %
              </Text>
            </PoolLeftInfo>
            <PoolRightInfo>
              <InfoLabel>
                <Text
                  size={TextSizes.SMALL}
                  height={TextHeights.SMALL}
                  weight={TextWeights.SEMIBOLD}
                >
                  {usedTokens} / {totalTokens} {token}
                </Text>
              </InfoLabel>
            </PoolRightInfo>
          </PoolInfoContainer>
        </PoolInfoPercentageContainer>
        <ActionContainer>
          <Button onClick={onClick} leftIcon={<Icon name={icon} />}>
            Stake with {token}
          </Button>
        </ActionContainer>
      </PoolBody>
    </PoolRoot>
  );
}

function WithdrawPool(props: PoolProps) {
  const {
    token,
    withdrawAmount,
    usedTokens,
    totalTokens,
    currentReward,
    maxReward,
    stakedAmount,
    percentage,
    icon,
    onClick,
    endDate,
  } = props;

  return (
    <PoolRoot>
      <PoolHeader>
        <PoolTitle>
          <IconContainer>
            <Icon name={icon} />
          </IconContainer>
          <Text weight={TextWeights.SEMIBOLD}>{token}</Text>
        </PoolTitle>
      </PoolHeader>
      <PoolBody filled>
        <PoolInfoContainer>
          <PoolLeftInfo>
            <InfoLabel>
              <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                Expectec Reward At {endDate}
              </Text>
            </InfoLabel>
            <Text
              size={TextSizes.SMALL}
              height={TextHeights.SMALL}
              weight={TextWeights.SEMIBOLD}
            >
              {maxReward}
            </Text>
          </PoolLeftInfo>
        </PoolInfoContainer>
        <PoolInfoPercentageContainer>
          <InfoLabel>
            <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
              Liquidity
            </Text>
          </InfoLabel>
          <ProgressRoot>
            <ProgressBar progress={percentage / 100} />
          </ProgressRoot>
          <PoolInfoContainer>
            <PoolLeftInfo>
              <Text
                size={TextSizes.SMALL}
                height={TextHeights.SMALL}
                weight={TextWeights.BOLD}
              >
                {percentage} %
              </Text>
            </PoolLeftInfo>
            <PoolRightInfo>
              <InfoLabel>
                <Text
                  size={TextSizes.SMALL}
                  height={TextHeights.SMALL}
                  weight={TextWeights.SEMIBOLD}
                >
                  {usedTokens} / {totalTokens} {token}
                </Text>
              </InfoLabel>
            </PoolRightInfo>
          </PoolInfoContainer>
        </PoolInfoPercentageContainer>
        <PoolInfoContainer>
          <PoolLeftInfo>
            <StakeLabel>
              <Text
                size={TextSizes.SMALL}
                height={TextHeights.SMALL}
                weight={TextWeights.SEMIBOLD}
              >
                Your Stake
              </Text>
            </StakeLabel>
            <StakeAmountContainer>
              <StakeAmount>
                <Text weight={TextWeights.BOLD}>{stakedAmount}</Text>
              </StakeAmount>
              <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                {token}
              </Text>
            </StakeAmountContainer>
          </PoolLeftInfo>
          <PoolRightInfo>
            <RewardLabel>
              <Text
                size={TextSizes.SMALL}
                height={TextHeights.SMALL}
                weight={TextWeights.SEMIBOLD}
              >
                Your Reward
              </Text>
            </RewardLabel>
            <RewardAmountContainer>
              <RewardAmount>
                <Text weight={TextWeights.BOLD}>{currentReward}</Text>
              </RewardAmount>
              <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                {token}
              </Text>
            </RewardAmountContainer>
          </PoolRightInfo>
        </PoolInfoContainer>
        <ActionContainer>
          <Button onClick={onClick} alternative>
            Withdraw {withdrawAmount} {token}
          </Button>
        </ActionContainer>
      </PoolBody>
    </PoolRoot>
  );
}

function Pool(props: PoolProps) {
  const { state } = props;

  const hasStaked = state === StakingStatus.STAKED;

  if (hasStaked) {
    return <WithdrawPool {...props} />;
  }

  return <StakePool {...props} />;
}

function Staking(props: StakingProps) {
  const { stakingDetails, stakingStatus, onClick } = props;

  const fclDetails = stakingDetails[TokenTypes.FCL];
  const fclEthLpDetails = stakingDetails[TokenTypes.FCL_ETH_LP];

  const fclStatus = stakingStatus[TokenTypes.FCL];
  const fclEthLpStatus = stakingStatus[TokenTypes.FCL_ETH_LP];

  const pools = [
    {
      id: 1,
      startDate: moment(fclDetails.stakingStartDate.toNumber(), "X").format(
        "Do MMMM",
      ),
      endDate: moment(fclDetails.stakingEndDate.toNumber(), "X").format(
        "Do MMMM",
      ),
      token: "FCL",
      apy: fclDetails.stakingAPY.toString() + "%",
      currentExpectedRewardRate:
        fclDetails.stakingCurrentExpectedRewardRate.toString() + "%",
      usedTokens: parseAndFormatEther(
        fclDetails.poolTotalTokens.sub(fclDetails.poolAvailableTokens),
      ),
      totalTokens: parseAndFormatEther(fclDetails.poolTotalTokens),
      currentReward: parseAndFormatEther(fclDetails.userCurrentReward),
      maxReward: parseAndFormatEther(fclDetails.userMaxReward),
      stakedAmount: parseAndFormatEther(fclDetails.userStakedAmount),
      withdrawAmount: parseAndFormatEther(
        fclDetails.userStakedAmount.add(fclDetails.userCurrentReward),
      ),
      percentage: getPercentage(
        parseEther(
          fclDetails.poolTotalTokens.sub(fclDetails.poolAvailableTokens),
        ),
        parseEther(fclDetails.poolTotalTokens),
      ),
      state: fclStatus,
      icon: IconNames.FRACTAL_TOKEN,
    },
    {
      id: 2,
      startDate: moment(
        fclEthLpDetails.stakingStartDate.toNumber(),
        "X",
      ).format("Do MMMM"),
      endDate: moment(fclEthLpDetails.stakingEndDate.toNumber(), "X").format(
        "Do MMMM",
      ),
      token: "FCL/ETH",
      apy: fclEthLpDetails.stakingAPY.toString() + "%",
      currentExpectedRewardRate:
        fclEthLpDetails.stakingCurrentExpectedRewardRate.toString() + "%",
      usedTokens: parseAndFormatEther(
        fclEthLpDetails.poolTotalTokens.sub(
          fclEthLpDetails.poolAvailableTokens,
        ),
      ),
      totalTokens: parseAndFormatEther(fclEthLpDetails.poolTotalTokens),
      currentReward: parseAndFormatEther(fclEthLpDetails.userCurrentReward),
      maxReward: parseAndFormatEther(fclEthLpDetails.userMaxReward),
      stakedAmount: parseAndFormatEther(fclEthLpDetails.userStakedAmount),
      withdrawAmount: parseAndFormatEther(
        fclEthLpDetails.userStakedAmount.add(fclEthLpDetails.userCurrentReward),
      ),
      percentage: getPercentage(
        parseEther(
          fclEthLpDetails.poolTotalTokens.sub(
            fclEthLpDetails.poolAvailableTokens,
          ),
        ),
        parseEther(fclEthLpDetails.poolTotalTokens),
      ),
      state: fclEthLpStatus,
      icon: IconNames.FRACTAL_ETH_TOKEN,
    },
  ];

  return (
    <TopComponent paddingTop="var(--s-12)">
      {pools.map((pool) => (
        <div key={pool.id}>
          <DateLabelContainer>
            <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
              Staking closes
            </Text>
          </DateLabelContainer>
          <DateContainer>
            <Text>{pool.startDate}</Text>
          </DateContainer>
          <Pool {...pool} onClick={onClick} />
        </div>
      ))}
    </TopComponent>
  );
}

export default Staking;
