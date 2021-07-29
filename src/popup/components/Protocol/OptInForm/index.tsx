import styled from "styled-components";

import Button from "@popup/components/common/Button";

import { useAppDispatch } from "@redux/stores/application/context";
import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";
import appActions from "@redux/stores/application/reducers/app";
import protocolActions from "@redux/stores/user/reducers/protocol";
import { getWallet } from "@redux/stores/user/reducers/protocol/selectors";

import Wallet from "@models/Wallet";

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function OptInForm() {
  const appDispatch = useAppDispatch();
  const userDispatch = useUserDispatch();
  const wallet = useUserSelector(getWallet);

  const onClick = () => {
    appDispatch(appActions.setProtocolOptIn(true));

    if (!wallet) {
      const newWallet = Wallet.generate();

      // TODO(frm): get the signing key from the server
      const signingKey = "//Fredie";

      userDispatch(protocolActions.setMnemonic(newWallet.mnemonic));
      userDispatch(protocolActions.setSigningKey(signingKey));
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

OptInForm.defaultProps = {};

export default OptInForm;
