import styled from "styled-components";

import { IAttestedClaim } from "@pluginTypes/index";

import CredentialStatus from "@models/Credential/status";

import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import Icon, { IconNames } from "@popup/components/common/Icon";
import LevelIcon from "@popup/components/common/LevelIcon";

const RootContainer = styled.div`
  display: flex;
  flex-direction: row;

  border-radius: var(--s-12);
  padding: var(--s-20) var(--s-12);

  background: var(--c-gray);

  color: var(--c-dark-blue);

  border: 1px solid rgba(19, 44, 83, 0.2);
`;

const LevelStatusContainer = styled.div`
  display: flex;
`;
const LevelContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const StatusContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

const NameBadgesContainer = styled.div`
  display: flex;
  margin-top: var(--s-12);
`;
const NameContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const BadgesContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const LevelName = styled.div`
  opacity: 0.6;
`;

const LevelIconContainer = styled.div`
  margin-right: var(--s-12);
`;

const CredentialWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StatusName = styled.div`
  opacity: 0.6;
  margin-right: var(--s-8);
`;

const Status = styled.div`
  display: flex;
  align-items: center;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  border-radius: var(--s-12);
  padding: var(--s-4) var(--s-12);

  background: var(--c-white);
`;
const BadgeName = styled.div`
  opacity: 0.6;
  color: var(--c-blue-dark);
`;

export type AttestedClaimProps = {
  credential: IAttestedClaim;
};

function AttestedClaim(
  props: AttestedClaimProps & React.HTMLProps<HTMLDivElement>,
) {
  const { credential } = props;

  const {
    status,
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

  if (status === CredentialStatus.VALID) {
    statusName = "Valid";
    statusIconName = IconNames.VALID;
  } else if (status === CredentialStatus.INVALID) {
    statusName = "Invalid";
    statusIconName = IconNames.INVALID;
  } else {
    statusName = "Pending";
    statusIconName = IconNames.PENDING;
  }

  return (
    <RootContainer>
      <LevelIconContainer>
        <LevelIcon level={level} />
      </LevelIconContainer>
      <CredentialWrapper>
        <LevelStatusContainer>
          <LevelContainer>
            <Text height={TextHeights.LARGE} weight={TextWeights.BOLD}>
              {levelName}
            </Text>
          </LevelContainer>
          <StatusContainer>
            <Status>
              <StatusName>
                <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                  {statusName}
                </Text>
              </StatusName>
              <Icon name={statusIconName} />
            </Status>
          </StatusContainer>
        </LevelStatusContainer>
        <NameBadgesContainer>
          <NameContainer>
            {hasName && (
              <LevelName>
                <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                  {name}
                </Text>
              </LevelName>
            )}
          </NameContainer>
          <BadgesContainer>
            <BadgeContainer>
              <BadgeName>
                <Text
                  size={TextSizes.SMALL}
                  height={TextHeights.SMALL}
                  weight={TextWeights.SEMIBOLD}
                >
                  Legacy
                </Text>
              </BadgeName>
            </BadgeContainer>
          </BadgesContainer>
        </NameBadgesContainer>
      </CredentialWrapper>
    </RootContainer>
  );
}

export default AttestedClaim;
