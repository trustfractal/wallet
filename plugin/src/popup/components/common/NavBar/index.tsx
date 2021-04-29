import React from "react";
import styled from "styled-components";
import Logo, { LogoSizes } from "@popup/components/common/Logo";

const RootContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function Navbar() {
  return (
    <RootContainer>
      <Logo size={LogoSizes.SMALL} />
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
