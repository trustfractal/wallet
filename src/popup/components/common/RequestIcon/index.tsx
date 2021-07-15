import React from "react";

import styled from "styled-components";
import Icon, { IconNames } from "@popup/components/common/Icon";

const RootContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  background: linear-gradient(
    180deg,
    #ffffff 18.75%,
    rgba(255, 255, 255, 0.4) 100%
  );
  border-radius: 50%;
  width: 80px;
  height: 80px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export type RequestIconProps = {
  requester: string;
};

function RequestIcon(props: RequestIconProps) {
  const { requester } = props;

  return (
    <RootContainer>
      <IconContainer>
        <img src={requester} alt="requester" width="40px" height="40px" />
      </IconContainer>
      <Icon name={IconNames.REQUEST} />
      <IconContainer>
        <Icon name={IconNames.LOGO} />
      </IconContainer>
    </RootContainer>
  );
}

export default RequestIcon;
