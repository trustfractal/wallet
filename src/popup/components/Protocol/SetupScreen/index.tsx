import { useEffect, useState } from "react";
import styled from "styled-components";

import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";

import { Subsubtitle } from "@popup/components/common/Subtitle";
import Button from "@popup/components/common/Button";

import Icon, { IconNames } from "@popup/components/common/Icon";

interface HeaderProps {
  logo: string;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Spacing = styled.div<{ size?: string }>`
  margin-bottom: ${(props) => props.size || "var(--s-20)"};
`;

const HeaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s-38) 0 var(--s-24);
`;

const CTA = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

function Header({ logo }: HeaderProps) {
  return (
    <HeaderContainer>
      <Icon name={logo} />
    </HeaderContainer>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <CTA>
      <Button onClick={onClick}>Restart</Button>
    </CTA>
  );
}

export function SetupSuccess({ onContinue }: { onContinue: () => void }) {
  return (
    <Container>
      <Header logo={IconNames.PROTOCOL_SETUP_SUCCESS} />

      <Text
        height={TextHeights.LARGE}
        size={TextSizes.LARGE}
        weight={TextWeights.BOLD}
      >
        We have created a Fractal Protocol address for you to receive minting
        rewards.
      </Text>

      <Spacing size="var(--s-12)" />

      <CTA>
        <Button onClick={onContinue}>Continue</Button>
      </CTA>

      <Spacing size="var(--s-12)" />

      <Subsubtitle>You can access your keys later</Subsubtitle>
    </Container>
  );
}

export function SetupError({ onRetry }: { onRetry: () => void }) {
  return (
    <Container>
      <Header logo={IconNames.PROTOCOL_SETUP_FAILURE} />

      <Text
        height={TextHeights.LARGE}
        size={TextSizes.LARGE}
        weight={TextWeights.BOLD}
      >
        Something went wrong.
      </Text>

      <Spacing />

      <ResetButton onClick={onRetry} />
    </Container>
  );
}

export function SetupInProgress({ onRetry }: { onRetry: () => void }) {
  const [showButton, setShowButton] = useState<boolean>();

  useEffect(() => {
    if (showButton) return;

    const timeout = setTimeout(() => setShowButton(true), 30000);

    return () => {
      clearTimeout(timeout);
    };
  }, [showButton]);

  return (
    <Container>
      <Header logo={IconNames.PROTOCOL_SETUP_PENDING} />

      <Text
        height={TextHeights.LARGE}
        size={TextSizes.LARGE}
        weight={TextWeights.BOLD}
      >
        Setting up a few things...
      </Text>

      <Text height={TextHeights.SMALL} size={TextSizes.SMALL}>
        Please stay tuned, this might take a few minutes.
      </Text>

      <Spacing />

      {showButton && <ResetButton onClick={onRetry} />}

      <Spacing />
    </Container>
  );
}
