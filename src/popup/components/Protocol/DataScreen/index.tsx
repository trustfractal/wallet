import styled from "styled-components";

import { useUserSelector } from "@redux/stores/user/context";
import { getWallet } from "@redux/stores/user/reducers/protocol/selectors";

import Wallet from "@models/Wallet";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";

// @ts-ignore
import Copy from "@assets/copy.svg";

interface AddressProps {
  wallet: Wallet;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
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

function Address({ wallet }: AddressProps) {
  return (
    <AddressContainer>
      <Text weight={TextWeights.BOLD}>FCL Address:</Text>

      <LineWithCopy>
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL} span>
          {wallet.address}
        </Text>

        <Copy onClick={() => navigator.clipboard.writeText(wallet.address)} />
      </LineWithCopy>
    </AddressContainer>
  );
}

function DataScreen() {
  const wallet = useUserSelector(getWallet);

  if (!wallet || !wallet.address) return <></>;

  return (
    <Container>
      <Address wallet={wallet} />
    </Container>
  );
}

DataScreen.defaultProps = {};

export default DataScreen;
