import styled, { css } from "styled-components";

import { ICredential } from "@fractalwallet/types";

import TopComponent from "@popup/components/common/TopComponent";
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

  border-radius: var(--s-12);
  padding: var(--s-24) var(--s-12);

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
    // @ts-ignore
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

  opacity: 0.6;
`;

const RightIconContainer = styled.div`
  opacity: 1;
  margin-left: var(--s-8);
`;

export type CredentialsProps = {
  credentials: ICredential[];
};

export type CredentialProps = {
  credential: ICredential;
};

function Credential(props: CredentialProps & React.HTMLProps<HTMLDivElement>) {
  const { credential } = props;

  const { valid } = credential;

  const level = "idbasic+liveness".split("+")[0];
  let levelName;
  let levelIconName;
  let statusName;
  let statusIconName;

  if (level === "idbasic") {
    levelName = "ID Basic";
    levelIconName = IconNames.ID_BASIC;
  } else {
    levelName = "ID Plus";
    levelIconName = IconNames.ID_PLUS;
  }

  if (valid) {
    statusName = "Verified";
    statusIconName = IconNames.ID_PLUS;
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
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
          {statusName}
        </Text>
        <RightIconContainer>
          <Icon name={statusIconName} />
        </RightIconContainer>
      </RightContainer>
    </RootContainer>
  );
}

function Credentials(props: CredentialsProps) {
  const { credentials } = props;

  return (
    <TopComponent>
      {credentials.map((credential: ICredential) => (
        <Credential key={credential.id} credential={credential} />
      ))}
    </TopComponent>
  );
}

Credentials.defaultProps = {
  credentials: [],
};

export default Credentials;
