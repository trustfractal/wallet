import { useEffect, useState } from "react";
import styled from "styled-components";

import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";

import { Subsubtitle } from "@popup/components/common/Subtitle";
import Button from "@popup/components/common/Button";
import TopComponent from "@popup/components/common/TopComponent";

import protocolActions, {
  protocolRegistrationTypes,
} from "@redux/stores/user/reducers/protocol";
import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";
import {
  getWallet,
  getRegistrationState,
  hasRegistrationErrored,
} from "@redux/stores/user/reducers/protocol/selectors";
import Icon, { IconNames } from "@popup/components/common/Icon";
import appActions from "@redux/stores/application/reducers/app";
import { useAppDispatch } from "@redux/stores/application/context";
import Logo from "@popup/components/common/Logo";

import NoProtocolVerificationCase from "@popup/components/Protocol/NoProtocolVerificationCase";

interface ErrorProps {
  step?: string;
}

interface HeaderProps {
  logo: string;
}

const StatusMessages = {
  [protocolRegistrationTypes.STARTED]: "Generating address",
  [protocolRegistrationTypes.ADDRESS_GENERATED]: "Registering identity",
  [protocolRegistrationTypes.IDENTITY_REGISTERED]: "Registering for minting",
};

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

const Link = styled.a`
  cursor: pointer;
  color: var(--c-orange);
  text-decoration: underline;
`;

function Header({ logo }: HeaderProps) {
  return (
    <HeaderContainer>
      <Icon name={logo} />
    </HeaderContainer>
  );
}

function HeaderWithLogo() {
  return (
    <HeaderContainer>
      <Logo />
    </HeaderContainer>
  );
}

function ResetButton() {
  const userDispatch = useUserDispatch();
  const appDispatch = useAppDispatch();
  const onClick = () => {
    userDispatch(protocolActions.setRegistrationState(undefined));
    userDispatch(protocolActions.setRegistrationError(false));
    appDispatch(appActions.setProtocolOptIn(false));
  };

  return (
    <CTA>
      <Button onClick={onClick}>Restart</Button>
    </CTA>
  );
}

function StartSetup() {
  const dispatch = useUserDispatch();

  const onCreate = () => dispatch(protocolActions.createWallet());

  return (
    <Container>
      <HeaderWithLogo />

      <Text
        height={TextHeights.EXTRA_LARGE}
        size={TextSizes.LARGE}
        weight={TextWeights.BOLD}
      >
        You should only register a new identity if it isn't already associated
        with an account. If you already have registered please recover your
        account.
      </Text>

      <Spacing size="var(--s-26)" />

      <CTA>
        <Button onClick={onCreate}>Create</Button>
      </CTA>

      <Spacing size="var(--s-12)" />

      <Subsubtitle>
        If you need help on anything related to Fractal ID Wallet, please
        contact us at{" "}
        <Link href="mailto:support@fractal.id">support@fractal.id</Link>
      </Subsubtitle>
    </Container>
  );
}

function Success() {
  const wallet = useUserSelector(getWallet);
  const dispatch = useUserDispatch();

  if (!wallet) return <></>;

  const onClick = () => {
    dispatch(
      protocolActions.setRegistrationState(protocolRegistrationTypes.COMPLETED),
    );
  };

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

      <Spacing />

      <Subsubtitle>Your address</Subsubtitle>

      <Spacing size="var(--s-6)" />

      <Text>{wallet.address}</Text>

      <Spacing size="var(--s-12)" />

      <CTA>
        <Button onClick={onClick}>Got it</Button>
      </CTA>

      <Spacing size="var(--s-12)" />

      <Subsubtitle>You can access your keys later</Subsubtitle>
    </Container>
  );
}

function Error({ step }: ErrorProps) {
  const statusMessage = step && StatusMessages[step];
  const message = statusMessage ? ` while ${statusMessage.toLowerCase()}` : "";

  return (
    <Container>
      <Header logo={IconNames.PROTOCOL_SETUP_FAILURE} />

      <Text
        height={TextHeights.LARGE}
        size={TextSizes.LARGE}
        weight={TextWeights.BOLD}
      >
        Something went wrong{message}.
      </Text>

      <Spacing />

      <ResetButton />
    </Container>
  );
}

function SetupStep({ message }: { message: string }) {
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
        {message}...
      </Text>

      <Text height={TextHeights.SMALL} size={TextSizes.SMALL}>
        Please stay tuned, this might take a few minutes.
      </Text>

      <Spacing />

      {showButton && <ResetButton />}

      <Spacing />
    </Container>
  );
}

function Router() {
  const registrationErrored = useUserSelector(hasRegistrationErrored);
  const registrationState = useUserSelector(getRegistrationState);

  if (registrationErrored) return <Error step={registrationState} />;

  switch (registrationState) {
    case protocolRegistrationTypes.MISSING_CREDENTIAL:
      return <NoProtocolVerificationCase />;
    case protocolRegistrationTypes.STARTED:
    case protocolRegistrationTypes.ADDRESS_GENERATED:
    case protocolRegistrationTypes.IDENTITY_REGISTERED:
      return <SetupStep message={StatusMessages[registrationState]} />;
    case protocolRegistrationTypes.MINTING_REGISTERED:
      return <Success />;
    default:
      return <StartSetup />;
  }
}

function SetupScreen() {
  return (
    <TopComponent>
      <Container>
        <Router />
      </Container>
    </TopComponent>
  );
}

SetupScreen.defaultProps = {};

export default SetupScreen;
