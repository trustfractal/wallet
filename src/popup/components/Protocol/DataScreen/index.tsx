import styled from "styled-components";

import { useState, useEffect } from "react";
import { getProtocolOptIn } from "@services/Factory";

import Wallet from "@models/Wallet";
import Button from "@popup/components/common/Button";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import TopComponent from "@popup/components/common/TopComponent";

// @ts-ignore
import Copy from "@assets/copy.svg";
import WebpageViews from "./WebpageViews";

interface AddressProps {
  wallet: Wallet;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin: -8px 0;
  > * {
    margin: 8px 0;
  }
`;

const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LineWithCopy = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > span {
    margin-right: 5px;
  }

  > svg {
    &:hover {
      cursor: pointer;
    }
  }
`;

const Spacing = styled.div`
  margin-bottom: var(--s-24);
`;

function Address({ wallet }: AddressProps) {
  return (
    <AddressContainer>
      <Text weight={TextWeights.BOLD}>Your Address</Text>

      <LineWithCopy>
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL} span>
          {wallet.address}
        </Text>

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
  const [hasLiveness, setHasLiveness] = useState(false);

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
    <TopComponent>
      <Container>
        <AddLiveness />
        <WebpageViews />
        <Spacing />
        <Address wallet={wallet} />
      </Container>
    </TopComponent>
  );
}

DataScreen.defaultProps = {};

export default DataScreen;
