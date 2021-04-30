import styled from "styled-components";
import * as dayjs from "dayjs";
import { utils as ethersUtils } from "ethers";

import Text, { TextWeights } from "@popup/components/common/Text";
import Button from "@popup/components/common/Button";
import Icon, { IconNames } from "@popup/components/common/Icon";
import StakingDetails from "@models/Staking/StakingDetails";
import TokenTypes from "@models/Token/types";

import StakingStatus from "@models/Staking/status";

const Root = styled.div`
  padding: var(--s-24);
`;

const CardRoot = styled.div<{ filled: boolean }>`
  background-color: ${({ filled }) => (filled ? "#FFF7F4" : "var(--c-white)")};
  border-radius: var(--s-8);
  color: var(--c-dark-blue);
  margin-bottom: 38px;
  box-shadow: 0px 8px 12px #061a3a;
  overflow: hidden;
`;

const CardHeader = styled.div`
  border-bottom: 1px solid var(--c-gray);
  background-color: white;
  font-weight: bold;
  padding: 16px 10px;
`;

const CardBody = styled.div`
  padding: 16px 10px;
`;

const ProgressRoot = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background-color: rgba(255, 103, 29, 0.2);
  height: var(--s-12);
  width: 100%;
  margin-bottom: 4px;
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

const Label = styled(Text)`
  color: rgba(19, 44, 83, 0.6);
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const IconWrapper = styled.div`
  position: relative;
  display: inline;
  margin-right: 10px;
`;

const CardTitle = styled.div`
  display: flex;
`;

const RootLabel = styled(Label)`
  font-size: 12px;
  color: white;
  opacity: 0.6;
  margin-bottom: 12px;
`;

const Date = styled(Label)`
  color: white;
  font-size: 16px;
  margin-bottom: 20px;
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

export type CardProps = {
  id: number;
  startDate: string;
  token: string;
  apy: string;
  currentExpectedRewardRate: string;
  availabelTokens: string;
  totalTokens: string;
  currentReward: string;
  percentage: number;
  state: StakingStatus;
  icon: IconNames;
  onClick: () => void;
};

function Stake(props: CardProps) {
  const {
    token,
    apy,
    currentExpectedRewardRate,
    availabelTokens,
    totalTokens,
    percentage,
    icon,
    onClick,
  } = props;

  return (
    <CardRoot filled={false}>
      <CardHeader>
        <CardTitle>
          <IconWrapper>
            <Icon name={icon} />
          </IconWrapper>
          {token}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <ProgressInfo>
          <div>
            <Label>Current APY</Label>
            <Text weight={TextWeights.BOLD}>{apy}</Text>
          </div>
          <div>
            <Label>Expected Reward</Label>
            <Text weight={TextWeights.BOLD}>{currentExpectedRewardRate}</Text>
          </div>
        </ProgressInfo>
        <Label>Liquidity</Label>
        <ProgressRoot>
          <ProgressBar progress={percentage} />
        </ProgressRoot>
        <ProgressInfo>
          <Text weight={TextWeights.BOLD}>{percentage * 100} %</Text>
          <Label>
            {availabelTokens}/{totalTokens} {token}
          </Label>
        </ProgressInfo>
        <ButtonWrapper>
          <Button
            onClick={onClick}
            leftIcon={
              <IconWrapper>
                <Icon name={icon} />
              </IconWrapper>
            }
          >
            Stake with {token}
          </Button>
        </ButtonWrapper>
      </CardBody>
    </CardRoot>
  );
}

function Withdraw(props: CardProps) {
  const {
    token,
    apy,
    currentExpectedRewardRate,
    availabelTokens,
    totalTokens,
    currentReward,
    percentage,
    icon,
    onClick,
  } = props;

  return (
    <CardRoot filled>
      <CardHeader>
        <CardTitle>
          <IconWrapper>
            <Icon name={icon} />
          </IconWrapper>
          {token}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <ProgressInfo>
          <div>
            <Label>Current APY</Label>
            <Text weight={TextWeights.BOLD}>{apy}</Text>
          </div>
          <div>
            <Label>Expected Reward</Label>
            <Text weight={TextWeights.BOLD}>{currentExpectedRewardRate}</Text>
          </div>
        </ProgressInfo>
        <Label>Liquidity</Label>
        <ProgressRoot>
          <ProgressBar progress={percentage} />
        </ProgressRoot>
        <ProgressInfo>
          <Text weight={TextWeights.BOLD}>{percentage * 100} %</Text>
          <Label>
            {availabelTokens}/{totalTokens} {token}
          </Label>
        </ProgressInfo>
        <ButtonWrapper>
          <Button onClick={onClick} alternative>
            Withdraw {currentReward}
          </Button>
        </ButtonWrapper>
      </CardBody>
    </CardRoot>
  );
}

function Card(props: CardProps) {
  const { state, startDate } = props;

  const isStaked = state === StakingStatus.STAKED;

  if (isStaked) {
    return (
      <>
        <RootLabel>Staking closes</RootLabel>
        <Date>{startDate}</Date>
        <Withdraw {...props} />
      </>
    );
  }

  return (
    <>
      <RootLabel>Staking closes</RootLabel>
      <Date>{startDate}</Date>
      <Stake {...props} />
    </>
  );
}

function Staking(props: StakingProps) {
  const { stakingDetails, stakingStatus, onClick } = props;

  const fclDetails = stakingDetails[TokenTypes.FCL];
  const fclEthLpDetails = stakingDetails[TokenTypes.FCL_ETH_LP];

  const fclStatus = stakingStatus[TokenTypes.FCL];
  const fclEthLpStatus = stakingStatus[TokenTypes.FCL_ETH_LP];

  const cards = [
    {
      id: 1,
      // @ts-ignore
      startDate: dayjs(fclDetails.stakingStartDate.toNumber()).format(
        "DD MMMM",
      ),
      token: "FCL",
      apy: fclDetails.stakingAPY.toString() + "%",
      currentExpectedRewardRate:
        fclDetails.stakingCurrentExpectedRewardRate.toString() + "%",
      availabelTokens: ethersUtils.formatUnits(fclDetails.poolAvailableTokens),
      totalTokens: ethersUtils.formatUnits(fclDetails.poolTotalTokens),
      currentReward: ethersUtils.formatUnits(fclDetails.userCurrentReward),
      percentage: fclDetails.poolAvailableTokens
        .div(fclDetails.poolTotalTokens)
        .toNumber(),
      state: fclStatus,
      icon: IconNames.FRACTAL_TOKEN,
    },
    {
      id: 2,
      // @ts-ignore
      startDate: dayjs(fclEthLpDetails.stakingStartDate.toNumber()).format(
        "DD MMMM",
      ),
      token: "FCL/ETH",
      apy: fclEthLpDetails.stakingAPY.toString() + "%",
      currentExpectedRewardRate:
        fclEthLpDetails.stakingCurrentExpectedRewardRate.toString() + "%",
      availabelTokens: ethersUtils.formatUnits(
        fclEthLpDetails.poolAvailableTokens,
      ),
      totalTokens: ethersUtils.formatUnits(fclEthLpDetails.poolTotalTokens),
      currentReward: ethersUtils.formatUnits(fclEthLpDetails.userCurrentReward),
      percentage: fclEthLpDetails.poolAvailableTokens
        .div(fclEthLpDetails.poolTotalTokens)
        .toNumber(),
      state: fclEthLpStatus,
      icon: IconNames.FRACTAL_ETH_TOKEN,
    },
  ];

  return (
    <Root>
      {cards.map((card) => (
        <Card key={card.id} {...card} onClick={onClick} />
      ))}
    </Root>
  );
}

export default Staking;
