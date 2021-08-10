import { Dispatch, useEffect, useState } from "react";
import { AnyAction } from "redux";
import styled from "styled-components";
import type { AccountData } from "@polkadot/types/interfaces";

import { useAppDispatch } from "@redux/stores/application/context";
import { useUserSelector } from "@redux/stores/user/context";
import appActions from "@redux/stores/application/reducers/app";
import {
  getWallet,
  getRegistrationState,
  isRegisteredForMinting,
  hasRegistrationErrored,
} from "@redux/stores/user/reducers/protocol/selectors";

import { protocolRegistrationTypes } from "@redux/stores/user/reducers/protocol";

import Wallet from "@models/Wallet";
import { useProtocol } from "@services/ProtocolService";

import Button from "@popup/components/common/Button";

const RegistrationStatusMessages = {
  [protocolRegistrationTypes.STARTED]: "Generating address",
  [protocolRegistrationTypes.ADDRESS_GENERATED]: "Registering identity",
  [protocolRegistrationTypes.IDENTITY_REGISTERED]: "Registering for minting",
  [protocolRegistrationTypes.COMPLETED]: "Generating address",
};

interface DispatchableComponent {
  dispatch: Dispatch<AnyAction>;
}

interface BalanceProps {
  hasWallet: boolean;
  isRegisteredForMinting: boolean;
  balance?: AccountData;
}

interface AddressProps {
  registrationErrored: boolean;
  registrationState: string | null;
  wallet?: Wallet;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function OptOut({ dispatch }: DispatchableComponent) {
  const onClick = () => {
    dispatch(appActions.setProtocolOptIn(false));
  };

  return <Button onClick={onClick}>Opt Out</Button>;
}

function Balance({ hasWallet, isRegisteredForMinting, balance }: BalanceProps) {
  if (!hasWallet || !isRegisteredForMinting) return <></>;

  if (!balance) return <p>Fetching your balance...</p>;

  return (
    <div>
      <p>
        <strong>Free: </strong>
        {balance.free.toNumber()} FCL
      </p>
      <p>
        <strong>Reserved: </strong>
        {balance.reserved.toNumber()} FCL
      </p>
    </div>
  );
}

function Address({
  registrationErrored,
  registrationState,
  wallet,
}: AddressProps) {
  if (!registrationState) return <></>;

  const statusMessage = RegistrationStatusMessages[registrationState];

  if (registrationErrored)
    return <p>Something went wrong while {statusMessage.toLowerCase()}.</p>;

  if (registrationState !== protocolRegistrationTypes.COMPLETED)
    return <p>{statusMessage}...</p>;

  if (wallet && wallet.address) return <p>Address: {wallet!.address}</p>;

  return <></>;
}

function OptedInScreen() {
  const appDispatch = useAppDispatch();
  const wallet = useUserSelector(getWallet);
  const registeredForMinting = useUserSelector(isRegisteredForMinting);
  const registrationErrored = useUserSelector(hasRegistrationErrored);
  const registrationState = useUserSelector(getRegistrationState);
  const [balance, setBalance] = useState<AccountData>();

  const protocol = useProtocol();

  useEffect(() => {
    if (!protocol || !wallet) return;

    const fetchBalance = async () => {
      const accountBalance = await protocol.getBalance(wallet!.address);
      setBalance(accountBalance);
    };

    fetchBalance();
  }, [protocol, wallet]);

  return (
    <Container>
      <p>You're opted in.</p>
      <br />
      <Address
        wallet={wallet}
        registrationErrored={registrationErrored}
        registrationState={registrationState}
      />
      <br />
      <br />

      <Balance
        hasWallet={!!wallet}
        isRegisteredForMinting={registeredForMinting}
        balance={balance}
      />

      <br />
      <br />

      <OptOut dispatch={appDispatch} />
    </Container>
  );
}

OptedInScreen.defaultProps = {};

export default OptedInScreen;
