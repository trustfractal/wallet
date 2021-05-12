import React from "react";

import styled from "styled-components";

const RootContainer = styled.div``;

const InputContainer = styled.input`
  width: var(--s-24);
  height: var(--s-24);
  border: 1px solid var(--c-dark-blue);
  outline: none;
  cursor: pointer;

  :checked {
    background-color: var(--c-orange);
    border: 1px solid var(--c-white);
  }
`;

function CheckboxInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { children, ...otherProps } = props;

  return (
    <RootContainer>
      <InputContainer type="checkbox" {...otherProps} />
    </RootContainer>
  );
}

export default CheckboxInput;
