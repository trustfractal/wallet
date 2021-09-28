import styled from "styled-components";

import Button from "@popup/components/common/Button";

import Icon, { IconNames } from "@popup/components/common/Icon";
import Text, { TextWeights } from "@popup/components/common/Text";
import Subtitle, { Subsubtitle } from "@popup/components/common/Subtitle";
import TopComponent from "@popup/components/common/TopComponent";

import environment from "@environment/index";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Spacing = styled.div<{ size?: string }>`
  margin-bottom: ${(props) => props.size || "var(--s-20)"};
`;

const List = styled.ul`
  list-style: none;

  li {
    display: grid;
    grid-template-columns: 0 1fr;
    grid-gap: var(--s-24);
    align-items: start;
    font-size: var(--s-16);
    line-height: var(--s-24);

    &:not(:last-child) {
      margin-bottom: var(--s-24);
    }

    &::before {
      content: "🚀";
    }
  }
`;

const CTA = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

function OptInForm({onOptIn}: {onOptIn: () => void}) {
  return (
    <TopComponent>
      <Container>
        <IconContainer>
          <Icon name={IconNames.PROTOCOL} />
        </IconContainer>

        <Spacing />

        <Text weight={TextWeights.BOLD}>
          Get ready for controlling and monetizing your own browsing data.
        </Text>

        <Spacing />

        <Subtitle uppercase>Wallet functionality</Subtitle>

        <Spacing size="var(--s-12)" />

        <List>
          <li>Tracks and stores your browsing data.</li>
          <li>The data is only stored on your local device. </li>
          <li>Publishes a proof of your data provisioning activity on chain</li>
          <li>
            You get rewards in {environment.PROTOCOL_CURRENCY} for storing your
            data.
          </li>
        </List>

        <Spacing size="var(--s-16)" />

        <Subsubtitle uppercase>
          By clicking “Opt In” you agree to our
        </Subsubtitle>

        <a
          href={`${environment.FRACTAL_WEBSITE_URL}/documents/mainnet-launch-special-user-agreement`}
          target="_blank"
          rel="noreferrer"
        >
          <Subsubtitle underline uppercase>
            Special Mainnet Launch User Agreement.
          </Subsubtitle>
        </a>

        <Spacing />

        <CTA>
          <Button onClick={onOptIn}>Opt In</Button>
        </CTA>
      </Container>
    </TopComponent>
  );
}

OptInForm.defaultProps = {};

export default OptInForm;
