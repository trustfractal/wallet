import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import type { AccountData, Balance } from "@polkadot/types/interfaces";

import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";
import appActions from "@redux/stores/application/reducers/app";
import { useUserSelector } from "@redux/stores/user/context";

import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import Logo, { LogoSizes } from "@popup/components/common/Logo";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import { IconNames } from "@popup/components/common/Icon";
import Menu from "@popup/components/common/Menu";

import { exportFile } from "@utils/FileUtils";

import RoutesPaths from "@popup/routes/paths";
import {
  getProtocolService,
  getRecoverMnemonicService,
} from "@services/Factory";
import { getRegistrationState } from "@redux/stores/user/reducers/protocol/selectors";
import { protocolRegistrationTypes } from "@redux/stores/user/reducers/protocol";

import environment from "@environment/index";

import { formatBalance } from "@utils/FormatUtils";

const NavbarContainer = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  padding: var(--s-19) var(--s-24);

  border-bottom: 1px solid var(--c-orange);
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: flex-start;

  margin-right: var(--s-24);
`;

const RootContainer = styled.div`
  position: relative;
  overflow: hidden;

  min-width: 400px;
  min-height: 460px;
`;

const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const BalanceTitleContainer = styled.div`
  color: var(--c-orange);
`;

const BalanceTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: flex-end;
`;

const BalanceFreeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-right: var(--s-10);
`;

const BalanceReservedContainer = styled.span`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const BalanceFree = styled.span`
  margin-right: var(--s-3);
`;

const BalanceReserved = styled.span<{ isPositive: boolean }>`
  color: ${(props) => (props.isPositive ? "var(--c-green)" : "var(--c-red)")};
  margin-right: var(--s-3);
`;

const BalanceReservedLabel = styled.span`
  opacity: 0.6;
`;

const toHuman = (balance: Balance) => Number(balance.toBigInt()) / 10 ** 12;

function MenuNavbar() {
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const credentials = useUserSelector(getCredentials);
  const registrationState = useUserSelector(getRegistrationState);

  const onClickExport = async () =>
    exportFile(credentials.serialize(), "fractal_wallet.backup");

  const onClickRefresh = () => appDispatch(appActions.refresh());

  const onClickAbout = () => history.push(RoutesPaths.ABOUT);

  const onClickMnemonic = () => history.push(RoutesPaths.MNEMONIC);

  const onClickImportMnemonic = () =>
    getRecoverMnemonicService().showRecoverPage();

  let menuItems = [
    {
      label: "Export your credentials",
      icon: IconNames.EXPORT,
      onClick: onClickExport,
      disabled: credentials.length === 0,
    },
    {
      label: "Backup protocol wallet",
      icon: IconNames.IMPORT,
      onClick: onClickMnemonic,
      disabled: registrationState !== protocolRegistrationTypes.COMPLETED,
    },
    {
      label: "Refresh",
      icon: IconNames.REFRESH,
      onClick: onClickRefresh,
    },
    {
      label: "About",
      icon: IconNames.ABOUT,
      onClick: onClickAbout,
    },
  ];

  const [showRecover, setShowRecover] = useState(false);
  useEffect(() => {
    getRecoverMnemonicService().onShowInMenu = (show) => {
      setShowRecover(show);
    };
  });

  if (showRecover) {
    menuItems.splice(1, 0, {
      label: "Import mnemonic",
      icon: IconNames.IMPORT,
      onClick: onClickImportMnemonic,
    });
  }

  return (
    <NavbarContainer>
      <LogoContainer>
        <Logo size={LogoSizes.SMALL} />
      </LogoContainer>
      <Text
        size={TextSizes.LARGE}
        height={TextHeights.LARGE}
        weight={TextWeights.BOLD}
      >
        Fractal Wallet
      </Text>
      <Menu items={menuItems} />
    </NavbarContainer>
  );
}

function ProtocolReservedBalance({ reserved }: { reserved: Balance }) {
  const reservedHuman = toHuman(reserved);

  if (reservedHuman === 0) return <></>;

  const isPositive = reservedHuman > 0;

  return (
    <BalanceReservedContainer>
      <BalanceReserved isPositive={isPositive}>
        <Text
          size={TextSizes.MEDIUM}
          height={TextHeights.MEDIUM}
          weight={TextWeights.BOLD}
        >
          {isPositive ? "+" : "-"}
          {formatBalance(reservedHuman)}
        </Text>
      </BalanceReserved>

      <BalanceReservedLabel>
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
          EXPECTED INCREASE
        </Text>
      </BalanceReservedLabel>
    </BalanceReservedContainer>
  );
}

function ProtocolBalance({ balance }: { balance?: AccountData }) {
  if (!balance)
    return (
      <BalanceContainer>
        <BalanceTitleContainer>
          <Text
            size={TextSizes.SMALL}
            height={TextHeights.SMALL}
            weight={TextWeights.BOLD}
          >
            BALANCE
          </Text>
        </BalanceTitleContainer>
        <BalanceTextContainer>Fetching balance...</BalanceTextContainer>
      </BalanceContainer>
    );

  const freeHuman = toHuman(balance.free);

  return (
    <BalanceContainer>
      <BalanceTitleContainer>
        <Text
          size={TextSizes.SMALL}
          height={TextHeights.SMALL}
          weight={TextWeights.BOLD}
        >
          BALANCE
        </Text>
      </BalanceTitleContainer>
      <BalanceTextContainer>
        <BalanceFreeContainer>
          <BalanceFree>
            <Text
              size={TextSizes.MEDIUM}
              height={TextHeights.MEDIUM}
              weight={TextWeights.BOLD}
            >
              {formatBalance(freeHuman)}
            </Text>
          </BalanceFree>

          <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
            {environment.PROTOCOL_CURRENCY}
          </Text>
        </BalanceFreeContainer>
        <ProtocolReservedBalance reserved={balance.reserved} />
      </BalanceTextContainer>
    </BalanceContainer>
  );
}

function ProtocolNavbar({ balance }: { balance: AccountData }) {
  const appDispatch = useAppDispatch();

  const history = useHistory();

  const credentials = useUserSelector(getCredentials);
  const registrationState = useUserSelector(getRegistrationState);

  const onClickExport = async () =>
    exportFile(credentials.serialize(), "fractal_wallet.backup");

  const onClickRefresh = () => appDispatch(appActions.refresh());

  const onClickAbout = () => history.push(RoutesPaths.ABOUT);

  const onClickMnemonic = () => history.push(RoutesPaths.MNEMONIC);

  const menuItems = [
    {
      label: "Export your credentials",
      icon: IconNames.EXPORT,
      onClick: onClickExport,
      disabled: credentials.length === 0,
    },
    {
      label: "Backup protocol wallet",
      icon: IconNames.IMPORT,
      onClick: onClickMnemonic,
      disabled: registrationState !== protocolRegistrationTypes.COMPLETED,
    },
    {
      label: "Refresh",
      icon: IconNames.REFRESH,
      onClick: onClickRefresh,
    },
    {
      label: "About",
      icon: IconNames.ABOUT,
      onClick: onClickAbout,
    },
  ];

  return (
    <NavbarContainer>
      <LogoContainer>
        <Logo size={LogoSizes.SMALL} />
      </LogoContainer>

      <ProtocolBalance balance={balance} />
      <Menu items={menuItems} />
    </NavbarContainer>
  );
}

function LogoNavbar() {
  return (
    <NavbarContainer>
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
    </NavbarContainer>
  );
}

export default function Navbar() {
  const setup = useAppSelector(isSetup);

  const [balance, setBalance] = useState<AccountData>();

  useEffect(() => {
    (async () => {
      const balance = await getProtocolService().getBalance();
      setBalance(balance);
    })();
  }, []);

  if (balance) {
    return <ProtocolNavbar balance={balance} />;
  }

  if (setup) {
    return <MenuNavbar />;
  }

  return <LogoNavbar />;
}

export const withNavBar =
  <P extends object>(
    Component: React.ComponentType<P>,
    withNavBarComponent = true,
  ) =>
  (props: any) => {
    const appDispatch = useAppDispatch();

    const ref = React.createRef<HTMLDivElement>();

    useEffect(() => {
      if (ref.current !== null) {
        const element = ref.current;
        const height =
          Math.max(element.scrollHeight, element.offsetHeight) + 24;

        appDispatch(appActions.setPopupSize({ height }));
      }
    }, [ref, appDispatch]);

    return (
      <>
        <RootContainer ref={ref}>
          {withNavBarComponent && <Navbar />}
          <Component {...(props as P)} />
        </RootContainer>
      </>
    );
  };
