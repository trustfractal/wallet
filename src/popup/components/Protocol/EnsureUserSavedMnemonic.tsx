/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  VerticalSequence,
  Cta,
  Title,
  Subtitle,
} from "@popup/components/Protocol/common";
import React from "react";
import styled from "styled-components";
import { getMnemonicSave } from "@services/Factory";
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
  setDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EnsureUserSavedMnemonic(props: { onComplete: () => void }) {
  const buttons: CheckButton[] = [];
  const mnemonic = getMnemonicSave().getSortedMnemonic();
  const [counter, setCounter] = React.useState(0);
  for (const word of mnemonic) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isDisabled, setDisable] = React.useState(false);

    buttons.push({
      word,
      isEnabled: !isDisabled,
      setDisable,
    });
  }

  return (
    <VerticalSequence>
      <Title>Please enter your mnemonic</Title>

      <ButtonContainer>
        {buttons.map((button, index) => {
          return (
            <Button
              key={button.word + index}
              disabled={!button.isEnabled}
              onClick={() => {
                const check = getMnemonicSave().checkWord(counter, button.word);
                button.setDisable(check);
                if (check) {
                  setCounter(counter + 1);
                }
                if (counter + 1 >= buttons.length) {
                  props.onComplete();
                }
              }}
            >
              {button.word}
            </Button>
          );
        })}
      </ButtonContainer>

      <Subtitle>I understand the importance of saving my mnemonic</Subtitle>
      <Button
        onClick={() => {
          props.onComplete();
        }}
      >
        Skip
      </Button>
    </VerticalSequence>
  );
}
