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
  disable: boolean;
  setDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EnsureUserSavedMnemonic(props: { onComplete: () => void }) {
  const buttons: CheckButton[] = [];
  const mnemonic = getMnemonicSave().getShuffledMnemonic();
  for (const word of mnemonic) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [disable, setDisable] = React.useState(false);
    buttons.push({
      word,
      disable,
      setDisable,
    });
  }

  return (
    <VerticalSequence>
      <Title>Please click your mnemonic in the correct order</Title>

      <ButtonContainer>
        {buttons.map((button) => {
          return (
            <Button
              key={button.word}
              disabled={button.disable}
              onClick={() => {
                const check = getMnemonicSave().checkWord(button.word);
                button.setDisable(check);
                if (getMnemonicSave().checked()) {
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
      <Cta
        onClick={() => {
          props.onComplete();
        }}
      >
        Skip
      </Cta>
    </VerticalSequence>
  );
}
