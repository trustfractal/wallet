/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  VerticalSequence,
  Title,
  Subtitle,
  ClickableText,
  Cta,
} from "@popup/components/Protocol/common";
import { useEffect } from "react";
import styled from "styled-components";
import { getProtocolOptIn } from "@services/Factory";
import { SetupSuccess as ShowMnemonic } from "./SetupScreen";
import { useState } from "react";
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
  &.ClickedWord {
    opacity: 0.4;
  }

  cursor: pointer;
  text-align: center;
  color: var(--c-white);
  background: var(--c-orange);
  border-radius: var(--s-12);
  padding: var(--s-10) var(--s-24);
  font-weight: bold;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  :hover {
    background: var(--c-dark-orange);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: var(--s-48);
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
    <Button
      className={(() => {
        return props.isEnabled ? "" : "ClickedWord";
      })()}
      onClick={props.onClick}
    >
      {props.word}
    </Button>
  );
};

function TextField(props: { input: string }) {
  return <TextArea defaultValue={props.input} />;
};

export function EnsureUserSavedMnemonic(props: { onComplete: () => void }) {
  const [pageOverride, setPageOverride] = useState<JSX.Element | null>(null);
  const [buttons, setButtons] = useState<CheckButton[]>([]);
  const [mnemonic, setMnemonic] = useState("");
  const [currentInput, setCurrentInput] = useState<string[]>([]);
  const success = currentInput.join(" ") === mnemonic;

  useEffect(() => {
    async function getMnemonic() {
      const localMnemonic = (await getProtocolOptIn().getMnemonic()) as string;
      const sortedMnemonic = localMnemonic.split(" ").sort();
      setMnemonic(localMnemonic);
      setButtons(sortedMnemonic.map((w) => ({ word: w, isEnabled: true })));
      setPageOverride(
        <ShowMnemonic
          mnemonic={localMnemonic as string}
          onContinue={() => setPageOverride(null)}
        />,
      );
    }

    getMnemonic();
  }, []);

  if (pageOverride != null) {
    return pageOverride;
  }

  return (
    <VerticalSequence>
      <Title>Please enter your mnemonic</Title>

      <ButtonContainer>
        {buttons.map((button: { word: string; isEnabled: boolean }, index) => (
          <WordButton
            key={index}
            onClick={() => {
              if (button.isEnabled) {
                setCurrentInput((oldArray) => [...oldArray, button.word]);
              } else {
                let once = true;
                setCurrentInput(currentInput.slice().reverse().filter(el => {
                    if (once && el === button.word) {
                        once = false;
                        return false;
                    }
                    return true;
                }).reverse());
              }

              setButtons([
                ...buttons.slice(0, index),
                { ...button, isEnabled: !button.isEnabled },
                ...buttons.slice(index + 1),
              ]);
            }}
            {...button}
          />
        ))}
      </ButtonContainer>

      <TextField input={currentInput.join(" ")}></TextField>

      <Cta
        disabled={!success}
        onClick={() => {
          props.onComplete();
        }}
      >
        Continue
      </Cta>

      <Cta
        onClick={() => {
          setPageOverride(
            <ShowMnemonic
              mnemonic={mnemonic as string}
              onContinue={() => setPageOverride(null)}
            />,
          );
        }}
      >
        Back to mnemonic
      </Cta>

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
