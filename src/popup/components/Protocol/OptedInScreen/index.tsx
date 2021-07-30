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
} from "@redux/stores/user/reducers/protocol/selectors";

import { useProtocol } from "@services/ProtocolService";

import Button from "@popup/components/common/Button";

interface DispatchableComponent {
  dispatch: Dispatch<AnyAction>;
}

interface BalanceProps {
  hasWallet: boolean;
  isRegistered: boolean;
  balance?: AccountData;
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

function Balance({ hasWallet, isRegistered, balance }: BalanceProps) {
  switch (true) {
    case !hasWallet:
      return <></>;
    case !isRegistered:
      return <p>Registering for minting...</p>;
    case balance === undefined:
      return <p>Fetching your balance...</p>;
    default:
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
}

function OptedInScreen() {
  const appDispatch = useAppDispatch();
  const wallet = useUserSelector(getWallet);
  const isRegistered = useUserSelector(isRegisteredForMinting);
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
      <p>Address: {wallet ? wallet.address : "Generating address..."}</p>
      <br />
      <br />

      <Balance
        hasWallet={!!wallet}
        isRegistered={isRegistered}
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
