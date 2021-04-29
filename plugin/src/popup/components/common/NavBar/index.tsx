import React from "react";
import styled from "styled-components";
import Logo, { LogoSizes } from "@popup/components/common/Logo";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";

const RootContainer = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  padding: var(--s-19) var(--s-24);

  border-bottom: 1px solid var(--c-orange);
`;

const LogoContainer = styled.div`
  margin-right: var(--s-24);
`;

export default function Navbar() {
  return (
    <RootContainer>
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
    </RootContainer>
  );
}

export const withNavBar = <P extends object>(
  Component: React.ComponentType<P>,
) => (props: any) => (
  <>
    <Navbar />
    <Component {...(props as P)} />
  </>
);
