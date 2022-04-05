/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  VerticalSequence,
  Title,
  Subtitle,
  ClickableText,
} from "@popup/components/Protocol/common";
import React, { useEffect } from "react";
import styled from "styled-components";
import { getProtocolOptIn } from "@services/Factory";
const ButtonContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  justify-items: stretch;
  align-items: inital;
`;

const Button = styled.button`
  cursor: pointer;
  text-align: center;
  color: var(--c-white);
  background: var(--c-orange);
  border-radius: var(--s-12);
  padding: var(--s-10) var(--s-24);
  font-weight: bold;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  :disabled {
    opacity: 0.4;
    cursor: default;
  }
  :hover {
    background: var(--c-dark-orange);
  }
`;

interface CheckButton {
  word: string;
  isEnabled: boolean;
}

const WordButton = (props: {
  word: string;
  isEnabled: boolean;
  onClick: () => void;
}) => {
  return (
    <Button disabled={!props.isEnabled} onClick={props.onClick}>
      {props.word}
    </Button>
  );
};

export function EnsureUserSavedMnemonic(props: { onComplete: () => void }) {
  const [buttons, setButtons] = React.useState<CheckButton[]>([]);
  const [mnemonicArr, setMnemonicArr] = React.useState<string[]>([]);

  const [counter, setCounter] = React.useState(0);

  useEffect(() => {
    async function getMnemonic() {
      const mnemonic = await getProtocolOptIn().getMnemonic();
      setMnemonicArr((mnemonic as string).split(" "));
      const sortedMnemonic = (mnemonic as string).split(" ").sort();
      setButtons(sortedMnemonic.map((w) => ({ word: w, isEnabled: true })));
    }

    getMnemonic();
  }, []);

  return (
    <VerticalSequence>
      <Title>Please enter your mnemonic</Title>

      <ButtonContainer>
        {buttons.map((button: { word: string; isEnabled: boolean }, index) => (
          <WordButton
            onClick={() => {
              const check = mnemonicArr[counter] === button.word;
              setButtons([
                ...buttons.slice(0, index),
                { ...button, isEnabled: !check },
                ...buttons.slice(index + 1),
              ]);
              if (check) {
                setCounter(counter + 1);
              }
              if (counter + 1 >= buttons.length) {
                props.onComplete();
              }
            }}
            {...button}
          />
        ))}
      </ButtonContainer>

      <Subtitle>I understand the importance of saving my mnemonic</Subtitle>
      <ClickableText
        onClick={() => {
          props.onComplete();
        }}
      >
        Skip
      </ClickableText>
    </VerticalSequence>
  );
}
