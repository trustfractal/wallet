import React from "react";
import styled from "styled-components";

const Root = styled.div`
  padding: var(--s-24);
`;

function TopComponent(props: React.HTMLProps<HTMLDivElement>) {
  const { children } = props;

  return <Root>{children}</Root>;
}

export default TopComponent;
