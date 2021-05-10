import React from "react";

import styled from "styled-components";

const Root = styled.p`
  font-size: var(--s-20);
  line-height: var(--s-32);
  font-weight: normal;
`;

function Text(props: React.HTMLAttributes<HTMLParagraphElement>) {
  const { children, ...otherProps } = props;

  return <Root {...otherProps}>{children}</Root>;
}

export default Text;
