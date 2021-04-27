import React from "react";

import Spinner from "@popup/components/common/Spinner";
import styled, { css } from "styled-components";

const Root = styled.button<{
  alternative: boolean;
  outline: boolean;
  disabled: boolean;
}>`
  color: var(--c-white);
  background: var(--c-orange);
  border-radius: var(--s-12);
  padding: var(--s-14) var(--s-35);
  font-weight: bold;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.6;
    `}

  ${(props) =>
    props.alternative &&
    css`
      color: var(--c-orange);
      background: var(--c-transparent);
      text-decoration: underline;
      text-transform: uppercase;
      font-weight: normal;
    `}

  ${(props) =>
    props.outline &&
    css`
      color: var(--c-orange);
      background: var(--c-transparent);
      border: 1px solid var(--c-orange);
    `}
`;

const LeftIconContainer = styled.div`
  margin-right: var(--s-12);
`;

const RightIconContainer = styled.div`
  margin-left: var(--s-12);
`;

export type ButtonProps = {
  loading: boolean;
  alternative: boolean;
  outline: boolean;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
};

Button.defaultProps = {
  loading: false,
  alternative: false,
  outline: false,
};

function Button(
  props: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const {
    loading,
    disabled,
    children,
    leftIcon,
    rightIcon,
    ...otherProps
  } = props;

  return (
    <Root disabled={disabled || loading} {...otherProps}>
      {loading && (
        <LeftIconContainer>
          <Spinner alternative={otherProps.alternative || otherProps.outline} />
        </LeftIconContainer>
      )}
      {leftIcon !== undefined && (
        <LeftIconContainer>{leftIcon}</LeftIconContainer>
      )}
      {children}
      {rightIcon !== undefined && (
        <RightIconContainer>{rightIcon}</RightIconContainer>
      )}
    </Root>
  );
}

export default Button;
