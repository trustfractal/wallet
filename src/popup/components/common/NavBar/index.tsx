import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

import { useAppSelector } from "@redux/stores/application/context";
import { useUserSelector } from "@redux/stores/user/context";

import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import { getAttestedClaims } from "@redux/stores/user/reducers/credentials/selectors";
import Logo, { LogoSizes } from "@popup/components/common/Logo";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import { IconNames } from "@popup/components/common/Icon";
import Menu from "@popup/components/common/Menu";

import { exportFile } from "@utils/FileUtils";

import WindowsService from "@services/WindowsService";

import RoutesPaths from "@popup/routes/paths";

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

function MenuNavbar() {
  const history = useHistory();

  const credentials = useUserSelector(getAttestedClaims);

  const onClickExport = async () =>
    exportFile(credentials.serialize(), "fractal_wallet.backup");
  const onClickImport = () => WindowsService.openTab("upload.html");
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
      <Text
        size={TextSizes.LARGE}
        height={TextHeights.LARGE}
        weight={TextWeights.BOLD}
      >
        Fractal Identity Wallet
      </Text>
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

  if (setup) {
    return <MenuNavbar />;
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
