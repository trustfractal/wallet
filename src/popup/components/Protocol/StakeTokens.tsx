import styled from "styled-components";
import { useState } from "react";
import humanizeDuration from "humanize-duration";
import ReactTooltip from "react-tooltip";

import { useLoadedState } from "@utils/ReactHooks";

import Button from "@popup/components/common/Button";
import Input from "@popup/components/common/Input";
import RadioInput from "@popup/components/common/RadioInput";
import {
  Cta,
  Title,
  Icon,
  IconNames,
  VerticalSequence,
} from "@popup/components/Protocol/common";

import { getProtocolService } from "@services/Factory";

const FCL_UNIT = BigInt(10 ** 12);

export function StakeTokens(props: { onFinish: () => void }) {
  const [page, setPage] = useState<"specify" | "confirm" | JSX.Element>(
    "specify",
  );

  const [amount, setAmount] = useState(BigInt(0));
  const [lockPeriod, setLockPeriod] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  const specify = (
    <Specify
      lockPeriod={lockPeriod}
      onChangeLockPeriod={setLockPeriod}
      amount={amount}
      onChangeAmount={setAmount}
      onContinue={() => setPage("confirm")}
    />
  );

  const confirm = (
    <Confirm
      lockPeriod={lockPeriod}
      amount={amount}
      onConfirm={async () => {
        setLoading(true);
        const hash = await getProtocolService().stakeTokens(lockPeriod, amount);
        setPage(<Complete onFinish={props.onFinish} hash={hash} />);
        setLoading(false);
      }}
      onCancel={() => setPage("specify")}
      loading={loading}
    />
  );

  if (page === "specify") {
    return specify;
  } else if (page === "confirm") {
    return confirm;
  } else {
    return page;
  }
}

const LockPeriodSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 8px;

  .lock-period-option {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 8px;

    p {
      margin: 0;
    }
  }

  [data-tip] {
    text-decoration: underline;
    text-decoration-style: dotted;
    cursor: help;
  }
`;

function Specify(props: {
  lockPeriod: number;
  onChangeLockPeriod: (a: number) => void;
  amount: bigint;
  onChangeAmount: (a: bigint) => void;
  onContinue: () => void;
}) {
  const lockPeriodOptionsLoader = useLoadedState(() =>
    getProtocolService().lockPeriodOptions(),
  );

  if (!lockPeriodOptionsLoader.isLoaded) return null;
  const lockPeriodOptions = lockPeriodOptionsLoader.value;

  if (!lockPeriodOptions.has(props.lockPeriod) && lockPeriodOptions.size > 0) {
    // Timout to handle React error of updating a component from another.
    setTimeout(() => {
      const smallestLockPeriod = Math.min(
        ...Array.from(lockPeriodOptions.keys()),
      );
      props.onChangeLockPeriod(smallestLockPeriod);
    });
    return null;
  }

  const lockPeriodSelectionElements = Array.from(lockPeriodOptions.entries())
    .sort((eA, eB) => eA[0] - eB[0])
    .map(([thisPeriod, shares]) => {
      return (
        <label className="lock-period-option" key={thisPeriod}>
          <RadioInput
            checked={thisPeriod === props.lockPeriod}
            onChange={() => props.onChangeLockPeriod(thisPeriod)}
          />
          <p>
            {humanizeBlocks(thisPeriod)} for{" "}
            <span data-tip data-for="distributionSharesTip">
              {shares} distribution shares
            </span>
          </p>
        </label>
      );
    });

  const validAmount = props.amount > BigInt(0);
  const validLock = lockPeriodOptions.has(props.lockPeriod);
  const isValid = validAmount && validLock;

  return (
    <ScreenContainer>
      <VerticalSequence>
        <Icon name={IconNames.PROTOCOL} />
        <Title>Stake Tokens</Title>

        <LockPeriodSelectionContainer>
          <ReactTooltip id="distributionSharesTip" place="top" effect="solid">
            By staking for longer periods of time and bigger amounts, you gain more distribution shares. Your actual rewarded coins will be proportional to the amount of distribution shares.
          </ReactTooltip>

          {lockPeriodSelectionElements}
        </LockPeriodSelectionContainer>

        <HorizontalContainer>
          <Input
            label="Amount"
            type="number"
            autoFocus
            value={
              props.amount === BigInt(0)
                ? ""
                : (props.amount / FCL_UNIT).toString()
            }
            onChange={(e) => {
              props.onChangeAmount(BigInt(e.target.value) * FCL_UNIT);
            }}
          />
        </HorizontalContainer>

        {!isValid ? null : (
          <p>
            Will lock{" "}
            <strong>{(props.amount / FCL_UNIT).toString()} FCL</strong> for{" "}
            <strong>{humanizeBlocks(props.lockPeriod)}</strong>, receiving{" "}
            <strong>{lockPeriodOptions.get(props.lockPeriod)}</strong>{" "}
            distribution shares.
          </p>
        )}

        <Cta disabled={!isValid} onClick={props.onContinue}>
          Stake
        </Cta>
      </VerticalSequence>
    </ScreenContainer>
  );
}

function humanizeBlocks(blocks: number): string {
  const secondsPerBlock = 6;
  const durationMs = blocks * secondsPerBlock * 1000;
  return humanizeDuration(durationMs, {
    units: ["w", "d", "h", "m"],
    round: true,
  });
}

function Confirm(props: {
  lockPeriod: number;
  amount: bigint;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <ScreenContainer>
      <VerticalSequence>
        <Icon name={IconNames.PROTOCOL} />
        <Title>Confirm Stake</Title>

        <p>
          Stake <strong>{(props.amount / FCL_UNIT).toString()} FCL</strong> for{" "}
          <strong>{props.lockPeriod}</strong> blocks?
        </p>

        <HorizontalContainer>
          <Button alternative loading={props.loading} onClick={props.onCancel}>
            Cancel
          </Button>
          <Cta loading={props.loading} onClick={props.onConfirm}>
            Stake
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

function Complete(props: { hash: string; onFinish: () => void }) {
  return (
    <ScreenContainer>
      <VerticalSequence>
        <Icon name={IconNames.PROTOCOL} />
        <Title>Stake Complete</Title>

        <p>Transaction ID</p>
        <p>
          <BreakStrong>{props.hash}</BreakStrong>
        </p>

        <Cta onClick={props.onFinish}>Return</Cta>
      </VerticalSequence>
    </ScreenContainer>
  );
}
