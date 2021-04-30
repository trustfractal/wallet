import styled from "styled-components";
import Text, { TextWeights } from "@popup/components/common/Text";
import Button from "../common/Button";
import Icon from "../common/Icon";

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

const Card = ({
  state,
  tokenName,
  progress,
  apy,
  reward,
}: {
  id: number;
  state: string;
  tokenName: string;
  progress: number;
  apy: string;
  reward: string;
}) => {
  return (
    <CardRoot filled={state == "withdraw"}>
      <CardHeader>
        <CardTitle>
          <IconWrapper>
            <Icon name="check" />
          </IconWrapper>
          {tokenName}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <ProgressInfo>
          <div>
            <Label>current apy</Label>
            <Text weight={TextWeights.BOLD}>{apy}</Text>
          </div>
          <div>
            <Label>expected reward</Label>
            <Text weight={TextWeights.BOLD}>{reward}</Text>
          </div>
        </ProgressInfo>
        <Label>Liquidity</Label>
        <ProgressRoot>
          <ProgressBar progress={progress} />
        </ProgressRoot>
        <ProgressInfo>
          <Text weight={TextWeights.BOLD}>{progress * 100}%</Text>
          <Label>10/1000 {tokenName}</Label>
        </ProgressInfo>
        <ButtonWrapper>
          <Button
            alternative={state === "withdraw"}
            leftIcon={
              <IconWrapper>
                <Icon name="check" />
              </IconWrapper>
            }
          >
            Stake with FCL
          </Button>
        </ButtonWrapper>
      </CardBody>
    </CardRoot>
  );
};

function Staking() {
  const cards = [
    {
      id: 1,
      tokenName: "FCL",
      apy: "40%",
      reward: "700%",
      progress: 0.8,
      state: "stake",
    },
    {
      id: 2,
      tokenName: "FCL",
      apy: "40%",
      reward: "700%",
      progress: 0.8,
      state: "withdraw",
    },
  ];

  return (
    <Root>
      <RootLabel>Staking closes</RootLabel>
      <Date>24th July</Date>
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </Root>
  );
}

export default Staking;
