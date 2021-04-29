import React from "react";

import styled, { css } from "styled-components";

const { default: Check } = require("@assets/check.svg");
const { default: Eye } = require("@assets/eye.svg");
const { default: EyeSlash } = require("@assets/eye-slash.svg");
const { default: Logo } = require("@assets/logo.svg");

const Root = styled.div<{ clickable: boolean }>`
  ${(props) =>
    props.clickable &&
    css`
      cursor: pointer;
    `}
`;

export enum IconNames {
  CHECK = "check",
  EYE = "eye",
  EYE_SLASH = "eye-slash",
  LOGO = "logo",
}

const Icons: Record<string, any> = {
  [IconNames.CHECK]: Check,
  [IconNames.EYE]: Eye,
  [IconNames.EYE_SLASH]: EyeSlash,
  [IconNames.LOGO]: Logo,
};

export type IconProps = {
  name: string;
  clickable: boolean;
  width?: string;
  height?: string;
};

Icon.defaultProps = {
  clickable: false,
};

function Icon(props: IconProps & React.HtmlHTMLAttributes<HTMLImageElement>) {
  const { name, clickable, onClick, ...otherProps } = props;

  const SVG = Icons[name];

  return (
    <Root clickable={clickable} onClick={onClick}>
      <SVG alt={name} {...otherProps} />
    </Root>
  );
}

export default Icon;
