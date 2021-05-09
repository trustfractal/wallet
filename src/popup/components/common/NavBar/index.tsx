import React from "react";
import styled from "styled-components";

import { AppStore } from "@redux/stores/application";
import { useAppSelector, useAppStore } from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import { UserStore } from "@redux/stores/user";
import { useUserSelector, useUserStore } from "@redux/stores/user/context";
import { getStakingDetails } from "@redux/stores/user/reducers/wallet/selectors";

import Logo, { LogoSizes } from "@popup/components/common/Logo";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import { IconNames } from "@popup/components/common/Icon";
import Menu from "@popup/components/common/Menu";
import TokenTypes from "@models/Token/types";

import { parseAndFormatEther } from "@utils/FormatUtils";
import { exportFile } from "@utils/FileUtils";

const LogoNavbarContainer = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  padding: var(--s-19) var(--s-24);

  border-bottom: 1px solid var(--c-orange);
`;

const BalanceNavbaContainer = styled.div`
  position: relative;
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

const BalanceAmountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-bottom: var(--s-4);
`;

const BalanceAmount = styled.div`
  width: 60px;
`;

const BalanceAmountsContainer = styled.div``;

const BalanceContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
  const appStore = useAppStore();
  const userStore = useUserStore();

  const stakingDetails: any = useUserSelector(getStakingDetails);

  const exportBackup = async () => {
    const app = await AppStore.serialize(appStore.getState());
    const user = await UserStore.serialize(userStore.getState());

    exportFile(JSON.stringify({ app, user }), "fractal_wallet.backup");
  };

  const menuItems = [
    {
      label: "Export your data",
      icon: IconNames.EXPORT,
      onClick: exportBackup,
    },
  ];

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
        <BalanceAmountsContainer>
          <BalanceAmountContainer>
            <BalanceAmount>
              <Text weight={TextWeights.BOLD}>
                {parseAndFormatEther(
                  stakingDetails[TokenTypes.FCL].userBalance,
                )}
              </Text>
            </BalanceAmount>
            <BalanceToken>
              <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                FCL
              </Text>
            </BalanceToken>
          </BalanceAmountContainer>
          <BalanceAmountContainer>
            <BalanceAmount>
              <Text weight={TextWeights.BOLD}>
                {parseAndFormatEther(
                  stakingDetails[TokenTypes.FCL_ETH_LP].userBalance,
                )}
              </Text>
            </BalanceAmount>
            <BalanceToken>
              <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                FCL/ETH
              </Text>
            </BalanceToken>
          </BalanceAmountContainer>
        </BalanceAmountsContainer>
      </BalanceContainer>
      <Menu items={menuItems} />
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
