import styled from "styled-components";

import Button from "@popup/components/common/Button";
import Text from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/common/TopComponent";
import { withNavBar } from "@popup/components/common/NavBar";
import Icon, { IconNames } from "@popup/components/common/Icon";

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--s-24);
  padding-bottom: var(--s-48);
`;
const ContentContainer = styled.div`
  margin-bottom: var(--s-10);
`;
const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s-24) 0;
`;

export type ConnectBackendRequestProps = {
  loading: boolean;
  onNext: () => void;
  error: string;
};

ConnectBackendRequest.defaultProps = {
  error: "",
};

function ConnectBackendRequest(props: ConnectBackendRequestProps) {
  const { loading, onNext } = props;

  return (
    <TopComponent>
      <IconContainer>
        <Icon name={IconNames.WELCOME} />
      </IconContainer>
      <ContentContainer>
        <Title>Welcome to Fractal ID Wallet v0.1.0</Title>
        <Text>
          <br />
        </Text>
        <Text>Major updates:</Text>
        <Text>
          · <strong>New</strong> Fractal self-attested credentials.
        </Text>
        <Text>
          <br />
        </Text>
        <Text>
          You’ll be redirected to Fractal ID, which is required to{" "}
          <strong>connect this wallet with your Fractal ID</strong>.
        </Text>
      </ContentContainer>
      <ActionContainer>
        <Button loading={loading} onClick={onNext}>
          Connect my Fractal ID
        </Button>
      </ActionContainer>
    </TopComponent>
  );
}

export default withNavBar(ConnectBackendRequest);
