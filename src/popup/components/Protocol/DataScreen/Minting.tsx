import styled from "styled-components";
import { BarLoader as Loader } from "react-spinners";

import { formatFloat } from "@utils/FormatUtils";
import { useLoadedState } from "@utils/ReactHooks";

import { getProtocolService } from "@services/Factory";
import {
  MintingHistoryEvent,
  MintingReceived,
  MintingRegistered,
} from "@services/ProtocolService";

import Text, { TextHeights, TextSizes } from "@popup/components/common/Text";
import { IconNames } from "@popup/components/common/Icon";
import { Activated, Hero } from "./Hero";

export function Minting() {
  const isRegistered = useLoadedState(async () => {
    return await getProtocolService().isRegisteredForMinting();
  });
  const callout = isRegistered
    .map((val) =>
      val
        ? ["Registered", IconNames.VALID]
        : ["Not Registered", IconNames.INVALID],
    )
    .unwrapOrDefault(["Loading", IconNames.PENDING]);

  const history = useLoadedState(async () => {
    return await getProtocolService().mintingHistory(4);
  });
  const historyItems = history
    .map((events) => {
      return events.map((event) => {
        return <HistoryItem key={event.at.getTime()} event={event} />;
      });
    })
    .unwrapOrDefault(
      <div className="loader">
        <Loader width={"100%"} color={"var(--c-orange)"} />
      </div>,
    );

  return (
    <Hero
      title="Minting"
      callout={<Activated text={callout[0]} icon={callout[1]} />}
    >
      <HistoryContainer>{historyItems}</HistoryContainer>
    </Hero>
  );
}

const HistoryContainer = styled.div`
  padding: var(--s-12);

  display: flex;
  flex-direction: column;

  .loader {
    align-self: stretch;

    display: flex;
  }
`;

function HistoryItem({ event }: { event: MintingHistoryEvent }) {
  const content = {
    received: (event: MintingReceived) => {
      return (
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
          Received{" "}
          <strong>{formatFloat(event.amount / 10 ** 12, 3)} FCL</strong>
        </Text>
      );
    },
    registered: (event: MintingRegistered) => {
      return (
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
          Registered for minting
        </Text>
      );
    },
  }[event.kind](event as any);

  return (
    <HistoryItemContainer>
      {content}

      <Text className="date" size={TextSizes.SMALL} height={TextHeights.SMALL}>
        {event.at.toLocaleString()}
      </Text>
    </HistoryItemContainer>
  );
}

const HistoryItemContainer = styled.div`
  color: black;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &:not(:last-child) {
    margin-bottom: var(--s-12);
    padding-bottom: var(--s-12);
    border-bottom: 1px solid var(--c-gray);
  }

  p {
    color: var(--c-dark-blue);
    white-space: nowrap;
  }

  .date {
    opacity: 0.6;
  }
`;
