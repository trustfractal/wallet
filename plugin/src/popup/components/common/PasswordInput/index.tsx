import React, { useState } from "react";

import styled from "styled-components";
import Input, { InputProps } from "@popup/components/common/Input";
import Icon, { IconNames } from "@popup/components/common/Icon";

const Root = styled.div`
  position: relative;
`;

const IconContainer = styled.div`
  position: absolute;
  top: var(--s-19);
  right: 0;
  padding: var(--s-5);
  cursor: pointer;
`;

function PasswordInput(
  props: InputProps & React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { children, ...otherProps } = props;

  const [type, setType] = useState("text");
  const [icon, setIcon] = useState(IconNames.EYE);

  const toggleVisibility = () => {
    if (type === "password") {
      setType("text");
      setIcon(IconNames.EYE);
    } else {
      setType("password");
      setIcon(IconNames.EYE_SLASH);
    }
  };

  return (
    <Root>
      <Input type={type} {...otherProps} />
      <IconContainer onClick={toggleVisibility}>
        <Icon name={icon} />
      </IconContainer>
    </Root>
  );
}

export default PasswordInput;
