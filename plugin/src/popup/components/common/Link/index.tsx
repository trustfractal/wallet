import React from "react";

import Text, { TextProps } from "@popup/components/common/Text";

import styled from "styled-components";

const Root = styled.span`
  cursor: pointer;
  color: var(--c-orange);
  text-decoration: underline;
`;

export type LinkProps = {
  onClick: () => void;
};

function Link(
  props: LinkProps & TextProps & React.HTMLAttributes<HTMLDivElement>,
) {
  const { children, onClick, ...otherProps } = props;

  return (
    <Root onClick={onClick}>
      <Text {...otherProps}>{children}</Text>
    </Root>
  );
}

export default Link;
