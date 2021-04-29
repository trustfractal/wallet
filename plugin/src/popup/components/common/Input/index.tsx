import React from "react";

import styled, { css } from "styled-components";
import Text, { TextSizes, TextHeights } from "@popup/components/common/Text";

const Root = styled.div`
  position: relative;
`;

const InputContainer = styled.input`
  color: var(--c-white);
  background-color: var(--c-dark-blue);
  font-size var(--s-16);
  line-height var(--s-19);
  border: 0;
  outline: none;
  padding: 0;
  padding-top: calc(var(--s-19) + var(--s-5));

  width: 100%;

  ::placeholder {
    color: var(--c-white);
    opacity: 0.6;
  }
`;

const LabelContainer = styled.div<{ active: boolean }>`
  position: absolute;
  pointer-events: none;
  opacity: 0.6;

  top: calc(var(--s-19) + var(--s-5));
  z-index: 10;
  transition: top 0.2s ease-in-out, font-size 0.2s ease-in-out,
    text-transform 0.2s ease-in-out;

  ${(props) =>
    props.active &&
    css`
      top: 0;
      text-transform: uppercase;
    `}
`;

const HintContainer = styled.div`
  margin-top: var(--s-12);
`;

const ErrorContainer = styled.div`
  margin-top: var(--s-12);
  color: var(--c-red);
`;

const LineContainer = styled.hr<{ active: boolean; error: boolean }>`
  border: 0;
  height: 1px;
  background: var(--c-white);
  margin-top: var(--s-12);
  transition: opacity 0.2s ease-in-out;

  ${(props) =>
    props.active &&
    css`
      opacity: 0.2;
    `}

  ${(props) =>
    props.error &&
    css`
      background: var(--c-red);
      opacity: 1;
    `}
`;

export type InputProps = {
  error?: string;
  label?: string;
  hint?: string;
};

function Input(
  props: InputProps & React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { error, label, hint, children, value, ...otherProps } = props;

  const active = value !== undefined && value.toString().length > 0;

  const hasError = error !== undefined && error.length > 0;
  const hasLabel = label !== undefined && label.length > 0;
  const hasHint = hint !== undefined && hint.length > 0;

  return (
    <Root>
      {hasLabel && (
        <LabelContainer active={active}>
          <Text
            size={active ? TextSizes.SMALL : TextSizes.MEDIUM}
            height={active ? TextHeights.SMALL : TextHeights.MEDIUM}
          >
            {label}
          </Text>
        </LabelContainer>
      )}
      <InputContainer value={value} {...otherProps}>
        {children}
      </InputContainer>
      <LineContainer active={active} error={hasError} />
      {hasError && (
        <ErrorContainer>
          <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
            {error}
          </Text>
        </ErrorContainer>
      )}
      {hasHint && (
        <HintContainer>
          <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
            {hint}
          </Text>
        </HintContainer>
      )}
    </Root>
  );
}

export default Input;
