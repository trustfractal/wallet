import styled from "styled-components";

import Button from "@popup/components/common/Button";
import Text from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/common/TopComponent";
import { withNavBar } from "@popup/components/common/NavBar";
import Icon, { IconNames } from "@popup/components/common/Icon";

const ContentContainer = styled.div`
  margin-top: var(--s-24);
  margin-bottom: var(--s-10);
`;
const Version = styled.span``;
const IconsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s-24) 0;
`;

export type AboutProps = {
  version: string;
  onNext: () => void;
};

function About(props: AboutProps) {
  const { onNext, version } = props;

  return (
    <TopComponent>
      <ContentContainer>
        <Title>
          Fractal ID Wallet{" "}
          <Version>
            <Text>{`v${version}`}</Text>
          </Version>
        </Title>
        <Text>
          <br />
        </Text>
        <Text>
          Fractal ID wallet is a browser credential that provides a mechanism to
          store and share KYC credentials signed by Fractal, which websites will
          be able to accept and verify on chain for compliance purposes, as an
          alternative to our OAuth flow.
        </Text>
        <Text>
          <br />
        </Text>
        <Text>
          This product includes software developed by the BOTLabs GmbH.
        </Text>
        <Text>
          <br />
        </Text>
        <IconsContainer>
          <Icon name={IconNames.FRACTAL_FULL_LOGO} />
          <Icon name={IconNames.KILT_FULL_LOGO} />
        </IconsContainer>
      </ContentContainer>
      <ActionContainer>
        <Button onClick={onNext}>Go to Dashboard</Button>
      </ActionContainer>
    </TopComponent>
  );
}

export default withNavBar(About);
