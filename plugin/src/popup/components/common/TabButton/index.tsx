import React from "react";

import styled, { css } from "styled-components";

const RootContainer = styled.button<{
  index: number;
  total: number;
  selected: boolean;
  disabled: boolean;
}>`
  display: flex;
  flex: 1;

  color: var(--c-orange);
  background: var(--c-transparent);
  border-bottom: 1px solid var(--c-orange);
  border-right: 1px solid var(--c-orange);
  border-left: 1px solid var(--c-orange);

  padding: var(--s-14) var(--s-35);
  height: 49px;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;

  ${(props) =>
    props.disabled &&
    css`
      display: flex;
      flex-direction: column;
      cursor: default;

      > span:first-child {
        opacity: 0.5;
        line-height: 24px;
      }

      > span:last-child {
        font-size: 12px;
        line-height: 16px;
        font-variant: all-small-caps;
        color: var(--c-white);
      }
    `}

  ${(props) =>
    props.selected &&
    css`
      font-weight: bold;
      color: var(--c-white);
      background: var(--c-orange);
    `}

  ${(props) =>
    props.index === 0 &&
    css`
      border-left-width: 0px;
    `}

  ${(props) =>
    props.index === props.total - 1 &&
    css`
      border-right-width: 0px;
    `}
`;

export type TabButtonProps = {
  disabled: boolean;
  selected: boolean;
  label: string;
  index: number;
  total: number;
};

TabButton.defaultProps = {
  disabled: false,
};

function TabButton(
  props: TabButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { index, total, label, disabled, selected, ...otherProps } = props;

  return (
    <RootContainer
      index={index}
      total={total}
      disabled={disabled}
      selected={selected}
      {...otherProps}
    >
      <span>{label}</span>
      {disabled && <span>Coming soon</span>}
    </RootContainer>
  );
}

export default TabButton;
