import { Dispatch } from "react";
import { AnyAction } from "redux";
import styled from "styled-components";

import Button from "@popup/components/common/Button";

import { useAppDispatch } from "@redux/stores/application/context";
import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";
import appActions from "@redux/stores/application/reducers/app";
import protocolActions from "@redux/stores/user/reducers/protocol";
import { getWallet } from "@redux/stores/user/reducers/protocol/selectors";

import ProtocolService from "@services/ProtocolService";
import { useProtocol } from "@services/ProtocolService/context";

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const optOut = (dispatch: Dispatch<AnyAction>) => {
  dispatch(appActions.setProtocolOptIn(false));
};

const registerForMinting = async (
  protocol: ProtocolService,
  dispatch: Dispatch<AnyAction>,
  address: string,
) => {
  // TODO(frm): Calculate proof
  const proof =
    "0x4004021ced8799296ceca557832ab941a50b4a11f83478cf141f51f933f653ab9fbcc05a037cddbed06e309bf334942c4e58cdf1a46e237911ccd7fcf9787cbc7fd0";

  const response = await protocol.registerForMinting(address, proof);
  console.log(response);

  dispatch(protocolActions.setRegisteredForMinting(true));
};

function OptedInScreen() {
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();
  const wallet = useUserSelector(getWallet);
  const protocol = useProtocol();

  const shouldRegister = !protocol || !wallet || !wallet.address;

  return (
    <Container>
      <p>You're opted in.</p>
      <br />
      <p>Address: {wallet ? wallet.address : "Generating address..."}</p>
      <br />
      <br />

      {shouldRegister ? (
        <Button disabled>Register for Minting</Button>
      ) : (
        <Button
          disabled={!protocol || !wallet || !wallet.address}
          onClick={() =>
            registerForMinting(protocol!, userDispatch, wallet!.address)
          }
        >
          Register for Minting
        </Button>
      )}

      <br />
      <br />

      <Button onClick={() => optOut(appDispatch)}>Opt Out</Button>
    </Container>
  );
}

OptedInScreen.defaultProps = {};

export default OptedInScreen;
