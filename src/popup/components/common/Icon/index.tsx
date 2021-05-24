import React from "react";

import styled, { css } from "styled-components";

const { default: Check } = require("@assets/check.svg");
const { default: ChevronRight } = require("@assets/chevron-right.svg");
const { default: ChevronLeft } = require("@assets/chevron-left.svg");
const { default: ChevronDown } = require("@assets/chevron-down.svg");
const { default: Eye } = require("@assets/eye.svg");
const { default: EyeSlash } = require("@assets/eye-slash.svg");
const { default: LogoName } = require("@assets/logo-name.svg");
const { default: Logo } = require("@assets/logo.svg");
const { default: LogoSmall } = require("@assets/logo-small.svg");
const { default: Success } = require("@assets/success.svg");
const { default: Connected } = require("@assets/connected.svg");
const { default: Robot } = require("@assets/robot.svg");
const { default: CheckOutline } = require("@assets/check-outline.svg");
const { default: IDBasicSmall } = require("@assets/id-basic-small.svg");
const { default: IDBasic } = require("@assets/id-basic.svg");
const { default: IDPlusSmall } = require("@assets/id-plus-small.svg");
const { default: IDPlus } = require("@assets/id-plus.svg");
const { default: Valid } = require("@assets/valid.svg");
const { default: Invalid } = require("@assets/invalid.svg");
const { default: Pending } = require("@assets/pending.svg");
const { default: FractalToken } = require("@assets/fractal-token.svg");
const { default: FractalEthToken } = require("@assets/fractal-eth-token.svg");
const { default: MenuActive } = require("@assets/menu-active.svg");
const { default: MenuInactive } = require("@assets/menu-inactive.svg");
const { default: Export } = require("@assets/export.svg");
const { default: Import } = require("@assets/import.svg");
const { default: Request } = require("@assets/request.svg");
const { default: Accepted } = require("@assets/accepted.svg");
const { default: Declined } = require("@assets/declined.svg");
const { default: Reconnect } = require("@assets/reconnect.svg");

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
  CHEVRON_RIGHT = "chevron-right",
  CHEVRON_LEFT = "chevron-left",
  CHEVRON_DOWN = "chevron-down",
  EYE = "eye",
  EYE_SLASH = "eye-slash",
  LOGO = "logo",
  LOGO_SMALL = "logo-small",
  LOGO_NAME = "logo-name",
  SUCCESS = "success",
  CONNECTED = "connected",
  ROBOT = "robot",
  CHECK_OUTLINE = "check-outline",
  ID_BASIC_SMALL = "id-basic-small",
  ID_BASIC = "id-basic",
  ID_PLUS_SMALL = "id-plus-small",
  ID_PLUS = "id-plus",
  VALID = "valid",
  INVALID = "invalid",
  PENDING = "pending",
  FRACTAL_TOKEN = "fractal-token",
  FRACTAL_ETH_TOKEN = "fractal-eth-token",
  MENU_ACTIVE = "menu-active",
  MENU_INACTIVE = "menu-inactive",
  EXPORT = "export",
  IMPORT = "import",
  REQUEST = "request",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  RECONNECT = "reconnect",
}

const Icons: Record<string, any> = {
  [IconNames.CHECK]: Check,
  [IconNames.CHEVRON_RIGHT]: ChevronRight,
  [IconNames.CHEVRON_LEFT]: ChevronLeft,
  [IconNames.CHEVRON_DOWN]: ChevronDown,
  [IconNames.EYE]: Eye,
  [IconNames.EYE_SLASH]: EyeSlash,
  [IconNames.LOGO_NAME]: LogoName,
  [IconNames.LOGO]: Logo,
  [IconNames.LOGO_SMALL]: LogoSmall,
  [IconNames.SUCCESS]: Success,
  [IconNames.CONNECTED]: Connected,
  [IconNames.ROBOT]: Robot,
  [IconNames.CHECK_OUTLINE]: CheckOutline,
  [IconNames.ID_BASIC_SMALL]: IDBasicSmall,
  [IconNames.ID_BASIC]: IDBasic,
  [IconNames.ID_PLUS_SMALL]: IDPlusSmall,
  [IconNames.ID_PLUS]: IDPlus,
  [IconNames.VALID]: Valid,
  [IconNames.INVALID]: Invalid,
  [IconNames.PENDING]: Pending,
  [IconNames.FRACTAL_TOKEN]: FractalToken,
  [IconNames.FRACTAL_ETH_TOKEN]: FractalEthToken,
  [IconNames.MENU_ACTIVE]: MenuActive,
  [IconNames.MENU_INACTIVE]: MenuInactive,
  [IconNames.EXPORT]: Export,
  [IconNames.IMPORT]: Import,
  [IconNames.REQUEST]: Request,
  [IconNames.ACCEPTED]: Accepted,
  [IconNames.DECLINED]: Declined,
  [IconNames.RECONNECT]: Reconnect,
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
