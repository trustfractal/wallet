import {
    VerticalSequence,
    Cta,
    Title,
    Subsubtitle
  } from "@popup/components/Protocol/common";
  import React from "react";
  import styled from 'styled-components';
import Subtitle from "../common/Subtitle";

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
    disable: boolean;
    setDisable: React.Dispatch<React.SetStateAction<boolean>>;
  }

  export function MnemonicSavedCheck(props: {
      skip: () => void,
      checkPhase: (phase: string) => boolean,
      mnemonic: string[],
  }) {
    const buttonMap: { [key: string]: CheckButton} = {};
    for (const phase of props.mnemonic ) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [disable, setDisable] = React.useState(false);
        buttonMap[phase] = {
            disable,
            setDisable,
        };
    }

    return (
      <VerticalSequence>
        <Title>Please click your mnemonic in the correct order</Title>

        <ButtonContainer>
        {props.mnemonic.map(phrase => {
            return <Button key={phrase} disabled={buttonMap[phrase].disable} onClick = {() => {
                const check = props.checkPhase(phrase);
                buttonMap[phrase].setDisable(check);
            }}>{phrase}</Button>
        })}
        </ButtonContainer>

        <Subtitle>I understand the importance of saving my mnemonic</Subtitle>
        <Cta onClick={props.skip}>Skip</Cta>
      </VerticalSequence>
    );
  }
