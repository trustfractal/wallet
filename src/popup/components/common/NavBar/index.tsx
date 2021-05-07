import React, { useState } from "react";
import styled from "styled-components";

import {
  useAppSelector,
  useAppDispatch,
} from "@redux/stores/application/context";
import { AppStore } from "@redux/stores/application";
import { UserStore } from "@redux/stores/user";
// import appActions from "@redux/stores/application/reducers/app";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import Logo, { LogoSizes } from "@popup/components/common/Logo";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import Icon, { IconNames } from "@popup/components/common/Icon";
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

const BalanceAmount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-bottom: var(--s-4);
`;
const BalanceAmountContainer = styled.div``;

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

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  background: ${(props) => (props.active ? "#ff671d" : "transparent")};
  transition-color: background 0.3s ease-in-out;
`;

const Menu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 0 26px;
  width: 292px;
  right: 8px;
  top: 100%;
  border-radius: 12px;
  background: #ff671d;
  transform: ${(props) =>
    props.active ? "translateX(0)" : "translateX(calc(100% + 8px))"};
  transition: transform 0.3s ease-in-out;
  z-index: 1;
`;

const MenuOverlay = styled.div`
  position: absolute;
  width: 292px;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #132c53;
  opacity: ${(props) => (props.active ? "0.2" : "0")};
  transition: opacity 0.3s ease-in-out;
  z-index: 0;
  pointer-events: none;
`;

const MenuLink = styled.button`
  display: flex;
  align-items: center;
  padding: 24px 0;
  background: none;
  color: white;
  cursor: pointer;
`;

const IconContainer = styled.div`
  margin-right: 12px;
`;

function BalanceNavbar() {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [encodedFile, setEncodedFile] = useState(false);
  const stakingDetails: any = useUserSelector(getStakingDetails);

  const exportBackup = async () => {
    const appState = await AppStore.getStoredState();
    const userState = await UserStore.getStoredState();

    const encodedState = btoa(JSON.stringify({ appState, userState }));

    const blob = new Blob([encodedState], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "fractal_wallet.backup";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reconnect = () => {};

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
      <MenuButton active={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        <Icon name={IconNames.MENU} width="6px" height="26px" />
      </MenuButton>
      <Menu active={menuOpen}>
        <MenuLink onClick={exportBackup}>
          <IconContainer>
            <Icon name={IconNames.EXPORT} />
          </IconContainer>
          Export your data
        </MenuLink>
        <MenuLink onClick={reconnect}>
          <IconContainer>
            <Icon name={IconNames.RECONNECT} />
          </IconContainer>
          Reconnect to crypto wallet
        </MenuLink>
      </Menu>
      <MenuOverlay active={menuOpen} />
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
