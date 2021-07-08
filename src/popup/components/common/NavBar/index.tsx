import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

import { useAppSelector } from "@redux/stores/application/context";
import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";

import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import walletActions from "@redux/stores/user/reducers/wallet";

import { getStakingDetails } from "@redux/stores/user/reducers/wallet/selectors";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

import RoutesPaths from "@popup/routes/paths";

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

import windows from "@services/WindowsService";

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

const BalanceContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BalanceLabel = styled.div`
  color: var(--c-orange);
  margin-bottom: var(--s-8);
`;

const BalanceAmountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BalanceAmounts = styled.div`
  align-items: flex-end;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  margin-right: var(--s-12);
`;

const RootContainer = styled.div`
  position: relative;
`;

const BalanceTokens = styled.div``;

function BalanceNavbar() {
  const history = useHistory();
  const dispatch = useUserDispatch();

  const stakingDetails: any = useUserSelector(getStakingDetails);
  const credentials = useUserSelector(getCredentials);

  const onClickExport = async () =>
    exportFile(credentials.serialize(), "fractal_wallet.backup");
  const onClickImport = () => windows.openTab("upload.html");
  const onClickReconnect = () => dispatch(walletActions.connectWalletRequest());
  const onClickAbout = () => history.push(RoutesPaths.ABOUT);

  const menuItems = [
    [
      {
        label: "Export your data",
        icon: IconNames.EXPORT,
        onClick: onClickExport,
        disabled: credentials.length === 0,
      },
      {
        label: "Import your data",
        icon: IconNames.IMPORT,
        onClick: onClickImport,
      },
    ],
    {
      label: "Reconnect to crypto wallet",
      icon: IconNames.RECONNECT,
      onClick: onClickReconnect,
    },
    {
      label: "About",
      icon: IconNames.ABOUT,
      onClick: onClickAbout,
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
        <BalanceAmountContainer>
          <BalanceAmounts>
            <Text weight={TextWeights.BOLD}>
              {parseAndFormatEther(stakingDetails[TokenTypes.FCL].userBalance)}
            </Text>
            <Text weight={TextWeights.BOLD}>
              {parseAndFormatEther(
                stakingDetails[TokenTypes.FCL_ETH_LP].userBalance,
              )}
            </Text>
          </BalanceAmounts>
          <BalanceTokens>
            <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
              FCL
            </Text>
            <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
              FCL/ETH LP
            </Text>
          </BalanceTokens>
        </BalanceAmountContainer>
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

export const withNavBar =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: any) =>
    (
      <>
        <RootContainer>
          <Navbar />
          <Component {...(props as P)} />
        </RootContainer>
      </>
    );
