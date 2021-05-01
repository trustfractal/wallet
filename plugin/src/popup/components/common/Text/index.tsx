import React from "react";

import styled, { css } from "styled-components";

export enum TextSizes {
  SMALL = "var(--s-12)",
  MEDIUM = "var(--s-16)",
  LARGE = "var(--s-20)",
}

export enum TextHeights {
  SMALL = "var(--s-168)",
  MEDIUM = "var(--s-1875)",
  LARGE = "var(--s-23)",
}

export enum TextWeights {
  NORMAL = "normal",
  SEMIBOLD = "500",
  BOLD = "bold",
}

const Root = styled.p<TextProps>`
  ${(props) =>
    css`
      font-size: ${props.size};
      line-height: ${props.height};
      font-weight: ${props.weight};
    `}
`;

export type TextProps = {
  size: TextSizes;
  height: TextHeights;
  weight: TextWeights;
};

Text.defaultProps = {
  size: TextSizes.MEDIUM,
  height: TextHeights.MEDIUM,
  weight: TextWeights.NORMAL,
};

function Text(props: TextProps & React.HTMLAttributes<HTMLParagraphElement>) {
  const { children, ...otherProps } = props;

  return <Root {...otherProps}>{children}</Root>;
}

export default Text;
