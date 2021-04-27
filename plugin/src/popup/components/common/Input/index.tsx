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

  ::placeholder {
    color: var(--c-white);
    opacity: 0.6;
  }
`;

const Label = styled.div<{ active: boolean }>`
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

const Hint = styled.div`
  margin-top: var(--s-12);
`;

const Line = styled.hr<{ active: boolean }>`
  height: 1px;
  background: var(--c-white);
  margin-top: var(--s-12);

  ${(props) =>
    props.active &&
    css`
      opacity: 0.2;
    `}
`;

export type InputProps = {
  label?: string;
  hint?: string;
};

function Input(
  props: InputProps & React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { label, hint, children, value, ...otherProps } = props;

  const active = value !== undefined && value.toString().length > 0;

  return (
    <Root>
      {label && (
        <Label active={active}>
          <Text
            size={active ? TextSizes.SMALL : TextSizes.MEDIUM}
            height={active ? TextHeights.SMALL : TextHeights.MEDIUM}
          >
            {label}
          </Text>
        </Label>
      )}
      <InputContainer value={value} {...otherProps}>
        {children}
      </InputContainer>
      <Line active={active} />
      {hint && hint.length > 0 && (
        <Hint>
          <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
            {hint}
          </Text>
        </Hint>
      )}
    </Root>
  );
}

export default Input;
