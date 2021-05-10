import React from "react";

import styled from "styled-components";

const Root = styled.h2`
  font-size: var(--s-32);
  line-height: var(--s-38);
  font-weight: normal;
  margin-bottom: var(--s-24);
`;

function Title(props: React.HTMLProps<HTMLHeadingElement>) {
  const { children } = props;

  return <Root>{children}</Root>;
}

export default Title;
