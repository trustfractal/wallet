import styled from "styled-components";

import { ICredential } from "@pluginTypes/index";

import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import Icon, { IconNames } from "@popup/components/common/Icon";
import LevelIcon from "@popup/components/common/LevelIcon";

const RootContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-radius: var(--s-12);
  padding: var(--s-20) var(--s-12);

  background: var(--c-gray);

  color: var(--c-dark-blue);

  border: 1px solid rgba(19, 44, 83, 0.2);
`;

const LeftContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

const LevelIconContainer = styled.div`
  margin-right: var(--s-8);
`;

const LevelContentContainer = styled.div``;

const LevelName = styled.div`
  opacity: 0.6;
`;

const RightContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  align-self: flex-start;
`;

const RightTextContainer = styled.div`
  margin-right: var(--s-8);
  opacity: 0.6;
`;

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
  let statusName;
  let statusIconName;

  const addonsStr = addons.join(" + ");

  if (level === "basic") {
    levelName = `ID Basic + ${addonsStr}`;
  } else {
    levelName = `ID Plus + ${addonsStr}`;
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
        <LevelIconContainer>
          <LevelIcon level={level} />
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

export default Credential;
