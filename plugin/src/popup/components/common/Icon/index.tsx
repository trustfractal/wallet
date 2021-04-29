import React from "react";

import styled, { css } from "styled-components";

const { default: Check } = require("@assets/check.svg");
const { default: Eye } = require("@assets/eye.svg");
const { default: EyeSlash } = require("@assets/eye-slash.svg");
const { default: Logo } = require("@assets/logo.svg");
const { default: LogoSmall } = require("@assets/logo-small.svg");
const { default: Success } = require("@assets/success.svg");
const { default: Connected } = require("@assets/connected.svg");
const { default: Robot } = require("@assets/robot.svg");

const Root = styled.div<{
  clickable: boolean;
}>`
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
  LOGO_SMALL = "logo-small",
  SUCCESS = "success",
  CONNECTED = "connected",
  ROBOT = "robot",
}

const Icons: Record<string, any> = {
  [IconNames.CHECK]: Check,
  [IconNames.EYE]: Eye,
  [IconNames.EYE_SLASH]: EyeSlash,
  [IconNames.LOGO]: Logo,
  [IconNames.LOGO_SMALL]: LogoSmall,
  [IconNames.SUCCESS]: Success,
  [IconNames.CONNECTED]: Connected,
  [IconNames.ROBOT]: Robot,
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
