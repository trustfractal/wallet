import React from "react";
import styled from "styled-components";

import { useAppSelector } from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import Logo, { LogoSizes } from "@popup/components/common/Logo";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import TokenTypes from "@models/Token/types";
import { useUserSelector } from "@redux/stores/user/context";
import { getStakingDetails } from "@redux/stores/user/reducers/wallet/selectors";
import { parseAndFormatEther } from "@utils/FormatUtils";

const LogoNavbarContainer = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  padding: var(--s-19) var(--s-24);

  border-bottom: 1px solid var(--c-orange);
`;

const BalanceNavbaContainer = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;
  padding: var(--s-19) var(--s-24);

  border-bottom: 1px solid var(--c-orange);
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: flex-start;

  margin-right: var(--s-24);
`;

const BalanceAmount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  margin-bottom: var(--s-4);
`;
const BalanceAmountContainer = styled.div``;

const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const BalanceLabel = styled.div`
  color: var(--c-orange);
  margin-bottom: var(--s-8);
  width: 45px;
`;

const BalanceToken = styled.div`
  width: 45px;
  margin-left: var(--s-12);
`;

function BalanceNavbar() {
  const stakingDetails: any = useUserSelector(getStakingDetails);

  return (
    <BalanceNavbaContainer>
      <LogoContainer>
        <Logo size={LogoSizes.SMALL} />
      </LogoContainer>
      <BalanceContainer>
        <BalanceLabel>
          <Text
            size={TextSizes.SMALL}
            height={TextHeights.SMALL}
            weight={TextWeights.SEMIBOLD}
          >
            Balance
          </Text>
        </BalanceLabel>
        <BalanceAmountContainer>
          <BalanceAmount>
            <Text weight={TextWeights.BOLD}>
              {parseAndFormatEther(stakingDetails[TokenTypes.FCL].userBalance)}
            </Text>
            <BalanceToken>
              <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                FCL
              </Text>
            </BalanceToken>
          </BalanceAmount>
          <BalanceAmount>
            <Text weight={TextWeights.BOLD}>
              {parseAndFormatEther(
                stakingDetails[TokenTypes.FCL_ETH_LP].userBalance,
              )}
            </Text>
            <BalanceToken>
              <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                FCL/ETH
              </Text>
            </BalanceToken>
          </BalanceAmount>
        </BalanceAmountContainer>
      </BalanceContainer>
    </BalanceNavbaContainer>
  );
}

function LogoNavbar() {
  return (
    <LogoNavbarContainer>
      <LogoContainer>
        <Logo size={LogoSizes.SMALL} />
      </LogoContainer>
      <Text
        size={TextSizes.LARGE}
        height={TextHeights.LARGE}
        weight={TextWeights.BOLD}
      >
        Fractal Identity Wallet
      </Text>
    </LogoNavbarContainer>
  );
}

export default function Navbar() {
  const setup = useAppSelector(isSetup);

  if (setup) {
    return <BalanceNavbar />;
  }

  return <LogoNavbar />;
}

export const withNavBar = <P extends object>(
  Component: React.ComponentType<P>,
) => (props: any) => (
  <>
    <Navbar />
    <Component {...(props as P)} />
  </>
);
