import styled from "styled-components";
import { useState } from "react";
import { decodeAddress, encodeAddress } from "@polkadot/keyring";

import Button from "@popup/components/common/Button";
import Input from "@popup/components/common/Input";
import {
  Cta,
  Title,
  Icon,
  IconNames,
  VerticalSequence,
} from "@popup/components/Protocol/common";

import { getProtocolService } from "@services/Factory";

const FCL_UNIT = 10 ** 12;

export function SendTokens(props: { onFinish: () => void }) {
  const [page, setPage] = useState<"specify" | "confirm" | JSX.Element>(
    "specify",
  );

  const [amount, setAmount] = useState(0);
  const [destination, setDestination] = useState("");

  const [loading, setLoading] = useState(false);

  const specifySend = (
    <SpecifySend
      address={destination}
      onChangeAddress={setDestination}
      amount={amount}
      onChangeAmount={setAmount}
      onContinue={() => setPage("confirm")}
    />
  );

  const confirmSend = (
    <ConfirmSend
      address={destination}
      amount={amount}
      onConfirm={async () => {
        setLoading(true);
        const hash = await getProtocolService().sendToAddress(
          destination,
          amount,
        );
        setPage(<SendComplete onFinish={props.onFinish} hash={hash} />);
        setLoading(false);
      }}
      onCancel={() => setPage("specify")}
      loading={loading}
    />
  );

  if (page === "specify") {
    return specifySend;
  } else if (page === "confirm") {
    return confirmSend;
  } else {
    return page;
  }
}

function SpecifySend(props: {
  address: string;
  onChangeAddress: (a: string) => void;
  amount: number;
  onChangeAmount: (a: number) => void;
  onContinue: () => void;
}) {
  const validAddress = isValidAddress(props.address);
  const validAmount = props.amount > 0;
  const isValid = validAddress && validAmount;

  return (
    <ScreenContainer>
      <VerticalSequence>
        <Icon name={IconNames.PROTOCOL} />
        <Title>Send to Address</Title>

        <HorizontalContainer>
          <Input
            label="Destination"
            value={props.address}
            error={
              validAddress || props.address.length === 0
                ? undefined
                : "Invalid address"
            }
            spellCheck="false"
            onChange={(e) => props.onChangeAddress(e.target.value)}
          />
          <Input
            label="Amount"
            type="number"
            value={
              props.amount === 0 ? "" : (props.amount / FCL_UNIT).toString()
            }
            onChange={(e) => {
              props.onChangeAmount(
                Math.floor(Number(e.target.value) * FCL_UNIT),
              );
            }}
          />
        </HorizontalContainer>

        {isValid ? (
          <>
            <p>
              Will send{" "}
              <strong>{(props.amount / FCL_UNIT).toString()} FCL</strong> to
              address
            </p>
            <BreakStrong>{props.address}</BreakStrong>
          </>
        ) : null}

        <Cta disabled={!isValid} onClick={props.onContinue}>
          Send
        </Cta>
      </VerticalSequence>
    </ScreenContainer>
  );
}

function isValidAddress(address: string) {
  try {
    encodeAddress(decodeAddress(address));
    return true;
  } catch {
    return false;
  }
}

function ConfirmSend(props: {
  address: string;
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <ScreenContainer>
      <VerticalSequence>
        <Icon name={IconNames.PROTOCOL} />
        <Title>Confirm Send</Title>

        <p>
          Send <strong>{(props.amount / FCL_UNIT).toString()} FCL</strong> to
        </p>
        <BreakStrong>{props.address}</BreakStrong>

        <HorizontalContainer>
          <Button alternative loading={props.loading} onClick={props.onCancel}>
            Cancel
          </Button>
          <Cta loading={props.loading} onClick={props.onConfirm}>
            Send
          </Cta>
        </HorizontalContainer>
      </VerticalSequence>
    </ScreenContainer>
  );
}

const ScreenContainer = styled.div`
  padding: var(--s-12);
`;

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  column-gap: var(--s-12);
`;

const BreakStrong = styled.strong`
  word-break: break-all;
  text-align: center;
`;

function SendComplete(props: { hash: string; onFinish: () => void }) {
  return (
    <ScreenContainer>
      <VerticalSequence>
        <Icon name={IconNames.PROTOCOL} />
        <Title>Send Complete</Title>

        <p>Transaction ID</p>
        <p>
          <BreakStrong>{props.hash}</BreakStrong>
        </p>

        <Cta onClick={props.onFinish}>Return</Cta>
      </VerticalSequence>
    </ScreenContainer>
  );
}
