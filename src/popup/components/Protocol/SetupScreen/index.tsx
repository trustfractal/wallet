import { useEffect, useState } from "react";

import {
  Subtitle,
  Subsubtitle,
  Title,
  Cta,
  Icon,
  IconNames,
  VerticalSequence,
} from "@popup/components/Protocol/common";

export function SetupSuccess({ onContinue }: { onContinue: () => void }) {
  return (
    <VerticalSequence>
      <Icon name={IconNames.PROTOCOL_SETUP_SUCCESS} />

      <Title>You joined the Fractal Protocol!</Title>

      <Cta onClick={onContinue}>Continue</Cta>

      <Subsubtitle>You can access your keys soon</Subsubtitle>
    </VerticalSequence>
  );
}

export function SetupError({ onRetry }: { onRetry: () => void }) {
  return (
    <VerticalSequence>
      <Icon name={IconNames.PROTOCOL_SETUP_FAILURE} />

      <Title>Something went wrong</Title>

      <Cta onClick={onRetry}>Retry</Cta>
    </VerticalSequence>
  );
}

export function SetupInProgress({ onRetry }: { onRetry: () => void }) {
  const [showButton, setShowButton] = useState<boolean>();

  useEffect(() => {
    const timeout = setTimeout(() => setShowButton(true), 30000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <VerticalSequence>
      <Icon name={IconNames.PROTOCOL_SETUP_PENDING} />

      <Title>Setting things up</Title>

      <Subtitle>This may take some time</Subtitle>

      {showButton && <Cta onClick={onRetry}>Retry</Cta>}
    </VerticalSequence>
  );
}
