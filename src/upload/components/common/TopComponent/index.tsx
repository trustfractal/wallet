import React from "react";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  justify-content: center;
  flex: 1 0 auto;
  min-height: 0;
  width: 100%;
`;

function TopComponent(props: React.HTMLProps<HTMLDivElement>) {
  const { children } = props;

  return <Root>{children}</Root>;
}

export default TopComponent;
