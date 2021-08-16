import { Dispatch, AnyAction } from "redux";
import styled from "styled-components";

import Wallet from "@models/Wallet";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";

import { Subsubtitle } from "@popup/components/common/Subtitle";
import Button from "@popup/components/common/Button";

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
import { useEffect, useState } from "react";

interface SetupStepRouterProps {
  registrationState?: string;
  registrationErrored?: boolean;
  wallet?: Wallet;
  dispatch: Dispatch<AnyAction>;
}

interface ErrorProps {
  step?: string;
}

interface SuccessProps {
  wallet?: Wallet;
  dispatch: Dispatch<AnyAction>;
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
  padding: var(--s-48) 0 var(--s-24);
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

function Success({ wallet, dispatch }: SuccessProps) {
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
        We have created a Substrate address for you to receive minting rewards.
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
  const message = step ? `while ${StatusMessages[step].toLowerCase()}` : "";

  return (
    <Container>
      <Header logo={IconNames.PROTOCOL_SETUP_FAILURE} />

      <Text
        height={TextHeights.LARGE}
        size={TextSizes.LARGE}
        weight={TextWeights.BOLD}
      >
        Something went wrong {message}.
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

      <Spacing />

      {showButton && <ResetButton />}

      <Spacing />
    </Container>
  );
}

function Router({
  registrationState,
  registrationErrored,
  wallet,
  dispatch,
}: SetupStepRouterProps) {
  if (registrationErrored) return <Error step={registrationState} />;

  switch (registrationState) {
    case protocolRegistrationTypes.STARTED:
    case protocolRegistrationTypes.ADDRESS_GENERATED:
    case protocolRegistrationTypes.IDENTITY_REGISTERED:
      return <SetupStep message={StatusMessages[registrationState]} />;
    case protocolRegistrationTypes.MINTING_REGISTERED:
      return <Success wallet={wallet} dispatch={dispatch} />;
    default:
      return (
        <SetupStep
          message={StatusMessages[protocolRegistrationTypes.STARTED]}
        />
      );
  }
}

function SetupScreen() {
  const registrationErrored = useUserSelector(hasRegistrationErrored);
  const registrationState = useUserSelector(getRegistrationState);
  const wallet = useUserSelector(getWallet);
  const userDispatch = useUserDispatch();

  return (
    <Container>
      <Router
        registrationErrored={registrationErrored}
        registrationState={registrationState}
        wallet={wallet}
        dispatch={userDispatch}
      />
    </Container>
  );
}

SetupScreen.defaultProps = {};

export default SetupScreen;
