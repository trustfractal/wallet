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

export type PasswordInputProps = {
  defaultVisible: boolean;
};

PasswordInput.defaultProps = {
  defaultVisible: false,
};

function PasswordInput(
  props: PasswordInputProps &
    InputProps &
    React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { children, defaultVisible, ...otherProps } = props;

  const [type, setType] = useState(defaultVisible ? "text" : "password");
  const [icon, setIcon] = useState(
    defaultVisible ? IconNames.EYE : IconNames.EYE_SLASH,
  );

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
      <Input type={type} style={{ width: "80%" }} {...otherProps} />
      <IconContainer onClick={toggleVisibility}>
        <Icon name={icon} />
      </IconContainer>
    </Root>
  );
}

export default PasswordInput;
