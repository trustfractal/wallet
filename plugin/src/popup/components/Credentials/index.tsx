import styled, { css } from "styled-components";

import { ICredential } from "@fractalwallet/types";

import TopComponent from "@popup/components/common/TopComponent";
import Title from "@popup/components/common/Title";
import Button from "@popup/components/common/Button";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import Icon, { IconNames } from "@popup/components/common/Icon";

const RootContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: var(--s-32);

  border-radius: var(--s-12);
  padding: var(--s-20) var(--s-12);

  background: var(--c-gray);

  color: var(--c-dark-blue);
`;

const LeftContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const LeftIconContainer = styled.div<{ levelIconName: IconNames }>`
  margin-right: var(--s-8);
  border-radius: 100%;

  ${(props) =>
    props.levelIconName === IconNames.ID_BASIC &&
    css`
      background: radial-gradient(
        57.81% 68.75% at 23.44% 15.62%,
        #a5c8ff 5.21%,
        #4073c2 44.35%,
        #132c53 87.5%,
        #00122f 100%
      );
      box-shadow: 0px 8px 12px #aabdda;
    `}

  ${(props) =>
    props.levelIconName === IconNames.ID_PLUS &&
    css`
      background: radial-gradient(
        57.81% 68.75% at 23.44% 15.62%,
        #ffeadf 10.04%,
        #ffc6aa 44.35%,
        #ff671d 87.5%,
        #e14a00 100%
      );
      box-shadow: 0px 8px 12px #ffc4a8;
    `}
`;

const RightContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const RightTextContainer = styled.div`
  margin-right: var(--s-8);
  opacity: 0.6;
`;

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

export type CredentialsProps = {
  credentials: ICredential[];
  onClickEmpty: () => void;
};

export type CredentialProps = {
  credential: ICredential;
};

export type EmptyCredentialsProps = {
  onClick: () => void;
};

function Credential(props: CredentialProps & React.HTMLProps<HTMLDivElement>) {
  const { credential } = props;

  const { valid } = credential;

  const level = credential.level.split("+")[0];
  let levelName;
  let levelIconName;
  let statusName;
  let statusIconName;

  if (level === "basic") {
    levelName = "ID Basic";
    levelIconName = IconNames.ID_BASIC;
  } else {
    levelName = "plus";
    levelIconName = IconNames.ID_PLUS;
  }

  if (valid) {
    statusName = "Verified";
    statusIconName = IconNames.VERIFIED;
  } else {
    statusName = "Pending";
    statusIconName = IconNames.PENDING;
  }

  return (
    <RootContainer>
      <LeftContainer>
        <LeftIconContainer levelIconName={levelIconName}>
          <Icon name={levelIconName} />
        </LeftIconContainer>
        <Text height={TextHeights.LARGE} weight={TextWeights.BOLD}>
          {levelName}
        </Text>
      </LeftContainer>
      <RightContainer>
        <RightTextContainer>
          <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
            {statusName}
          </Text>
        </RightTextContainer>
        <Icon name={statusIconName} />
      </RightContainer>
    </RootContainer>
  );
}

function EmptyCredentials(props: EmptyCredentialsProps) {
  const { onClick } = props;

  return (
    <TopComponent>
      <IconContainer>
        <Icon name={IconNames.ROBOT} />
      </IconContainer>
      <ContentContainer>
        <Title>You haven’t issued a credential yet.</Title>
        <Text>
          <br />
        </Text>
        <Text>
          You can only issue a credential through your Fractal dashboard. The
          button below will redirect you to Fractal.
        </Text>
      </ContentContainer>
      <ActionContainer>
        <Button onClick={onClick}>Go to Fractal</Button>
      </ActionContainer>
    </TopComponent>
  );
}

function Credentials(props: CredentialsProps) {
  const { credentials, onClickEmpty } = props;

  if (credentials.length === 0) {
    return <EmptyCredentials onClick={onClickEmpty} />;
  }

  return (
    <TopComponent>
      {credentials.map((credential: ICredential) => (
        <Credential key={credential.level} credential={credential} />
      ))}
    </TopComponent>
  );
}

Credentials.defaultProps = {
  credentials: [],
};

export default Credentials;
