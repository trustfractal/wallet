import styled from "styled-components";

import { useState, useEffect } from "react";
import { getProtocolOptIn } from "@services/Factory";
import {
  Subsubtitle,
  Text,
  BoldText,
  VerticalSequence,
} from "@popup/components/Protocol/common";

import Wallet from "@models/Wallet";
import Button from "@popup/components/common/Button";

// @ts-ignore
import Copy from "@assets/copy.svg";
import { Minting } from "./Minting";
import WebpageViews from "./WebpageViews";

interface AddressProps {
  wallet: Wallet;
}

const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LineWithCopy = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 8px;
  }

  > svg {
    &:hover {
      cursor: pointer;
    }
  }
`;

function Address({ wallet }: AddressProps) {
  return (
    <AddressContainer>
      <BoldText>Your Address</BoldText>

      <LineWithCopy>
        <Subsubtitle>{wallet.address}</Subsubtitle>

        <Copy onClick={() => navigator.clipboard.writeText(wallet.address)} />
      </LineWithCopy>
    </AddressContainer>
  );
}

const LivenessContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

function AddLiveness() {
  const [hasLiveness, setHasLiveness] = useState(true);

  useEffect(() => {
    (async () => {
      setHasLiveness(await getProtocolOptIn().hasCompletedLiveness());
    })();
  });

  if (hasLiveness) return <></>;

  const postOptInLiveness = async () => {
    await getProtocolOptIn().postOptInLiveness();
  };

  return (
    <LivenessContainer>
      <Text>Add liveness to unlock minting rewards:</Text>
      <Button onClick={postOptInLiveness}>Add Liveness</Button>
    </LivenessContainer>
  );
}

function DataScreen() {
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    (async () => {
      const mnemonic = await getProtocolOptIn().getMnemonic();
      if (mnemonic) setWallet(Wallet.fromMnemonic(mnemonic));
    })();
  }, []);

  if (!wallet || !wallet.address) return <></>;

  return (
    <VerticalSequence>
      <AddLiveness />
      <Minting />
      <WebpageViews />
      <Address wallet={wallet} />
    </VerticalSequence>
  );
}

DataScreen.defaultProps = {};

export default DataScreen;
