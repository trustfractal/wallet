import React from "react";

import styled from "styled-components";
import Icon, { IconNames } from "@popup/components/common/Icon";

const Root = styled.div`
  background: var(--c-white);
  border-radius: 50%;
  width: 80px;
  height: 80px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export type LogoProps = {
  clickable?: boolean;
  width?: string;
  height?: string;
};

Logo.defaultProps = {
  clickable: false,
};

function Logo(props: LogoProps & React.HtmlHTMLAttributes<HTMLImageElement>) {
  return (
    <Root>
      <Icon name={IconNames.LOGO} />
    </Root>
  );
}

export default Logo;
