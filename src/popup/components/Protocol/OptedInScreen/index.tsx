import { Dispatch, useEffect, useState } from "react";
import { AnyAction } from "redux";
import styled from "styled-components";
import type { AccountData } from "@polkadot/types/interfaces";

import { useAppDispatch } from "@redux/stores/application/context";
import { useUserSelector } from "@redux/stores/user/context";
import appActions from "@redux/stores/application/reducers/app";
import {
  getWallet,
  isRegisteredForMinting,
  isRegistered,
} from "@redux/stores/user/reducers/protocol/selectors";

import Wallet from "@models/Wallet";
import { useProtocol } from "@services/ProtocolService";

import Button from "@popup/components/common/Button";

interface DispatchableComponent {
  dispatch: Dispatch<AnyAction>;
}

interface BalanceProps {
  hasWallet: boolean;
  isRegisteredForMinting: boolean;
  balance?: AccountData;
}

interface AddressProps {
  registrationSuccess: boolean;
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
  if (!hasWallet) return <></>;
  if (!isRegisteredForMinting) return <p>Registering for minting...</p>;

  if (balance === undefined) return <p>Fetching your balance...</p>;

  return (
    <div>
      <p>
        <strong>Free: </strong>
        {balance!.free.toNumber()} FCL
      </p>
      <p>
        <strong>Reserved: </strong>
        {balance!.reserved.toNumber()} FCL
      </p>
    </div>
  );
}

function Address({ registrationSuccess, wallet }: AddressProps) {
  if (!registrationSuccess)
    return <p>Something went wrong generating your address.</p>;

  if (wallet && wallet.address) return <p>Address: {wallet.address}</p>;

  return <p>Generating address...</p>;
}

function OptedInScreen() {
  const appDispatch = useAppDispatch();
  const wallet = useUserSelector(getWallet);
  const registeredForMinting = useUserSelector(isRegisteredForMinting);
  const registrationSuccess = useUserSelector(isRegistered);
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
      <Address wallet={wallet} registrationSuccess={registrationSuccess} />
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
