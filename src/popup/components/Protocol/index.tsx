import styled from "styled-components";

import Button from "@popup/components/common/Button";
import TopComponent from "@popup/components/common/TopComponent";

import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";

import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";

import appActions from "@redux/stores/application/reducers/app";
import protocolActions from "@redux/stores/user/reducers/protocol";

import { getProtocolOptIn } from "@redux/stores/application/reducers/app/selectors";
import { getWallet } from "@redux/stores/user/reducers/protocol/selectors";

import Wallet from "@models/Wallet";
import { Dispatch } from "react";
import { AnyAction } from "redux";

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function OptInForm(
  appDispatch: Dispatch<AnyAction>,
  userDispatch: Dispatch<AnyAction>,
  wallet?: Wallet,
) {
  const onClick = () => {
    appDispatch(appActions.setProtocolOptIn(true));

    if (!wallet) {
      const newWallet = Wallet.generate();

      userDispatch(protocolActions.setMnemonic(newWallet.mnemonic));
    }
  };

  return (
    <Container>
      <p>You need to opt-in to the Protocol first</p>
      <br />
      <p>Afterwards a new Fractal Protocol address will be generated.</p>
      <br />
      <br />

      <Button onClick={onClick}>Opt In</Button>
    </Container>
  );
}

function OptedInScreen(dispatch: Dispatch<AnyAction>, wallet?: Wallet) {
  const onNext = () => dispatch(appActions.setProtocolOptIn(false));

  return (
    <Container>
      <p>You're opted in.</p>
      <br />
      <p>Address: {wallet ? wallet.address : "Generating address..."}</p>
      <br />
      <br />

      <Button onClick={onNext}>Opt Out</Button>
    </Container>
  );
}

function Protocol() {
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();
  const wallet = useUserSelector(getWallet);
  const protocolOptIn = useAppSelector(getProtocolOptIn);

  return (
    <TopComponent>
      {protocolOptIn
        ? OptedInScreen(appDispatch, wallet)
        : OptInForm(appDispatch, userDispatch, wallet)}
    </TopComponent>
  );
}

Protocol.defaultProps = {};

export default Protocol;
