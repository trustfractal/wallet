import styled, { css } from "styled-components";

import { ICredential } from "@pluginTypes/index";

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
  align-items: flex-start;
  justify-content: flex-start;
`;

const LevelIconContainer = styled.div<{ levelIconName: IconNames }>`
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

const LevelContentContainer = styled.div``;

const LevelName = styled.div`
  opacity: 0.6;
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

export type CredentialsProps = {
  credentials: ICredential[];
};

export type CredentialProps = {
  credential: ICredential;
};

function Credential(props: CredentialProps & React.HTMLProps<HTMLDivElement>) {
  const { credential } = props;

  const {
    valid,
    claim: {
      properties: { full_name: name },
    },
  } = credential;

  let hasName = true;
  if (name === undefined || (name as String).length === 0) {
    hasName = false;
  }

  const [level, ...addons] = credential.level.split("+");
  let levelName;
  let levelIconName;
  let statusName;
  let statusIconName;

  const addonsStr = addons.join(" + ");

  if (level === "basic") {
    levelName = `ID Basic + ${addonsStr}`;
    levelIconName = IconNames.ID_BASIC;
  } else {
    levelName = `ID Plus + ${addonsStr}`;
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
        <LevelIconContainer levelIconName={levelIconName}>
          <Icon name={levelIconName} />
        </LevelIconContainer>
        <LevelContentContainer>
          <Text height={TextHeights.LARGE} weight={TextWeights.BOLD}>
            {levelName}
          </Text>
          {hasName && (
            <LevelName>
              <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                {name}
              </Text>
            </LevelName>
          )}
        </LevelContentContainer>
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

function Credentials(props: CredentialsProps) {
  const { credentials } = props;

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
