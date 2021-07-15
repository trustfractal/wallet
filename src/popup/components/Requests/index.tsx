import { useState } from "react";
import styled, { css } from "styled-components";

import CredentialsCollection from "@models/Credential/CredentialsCollection";
import RequestsCollection from "@models/Request/RequestsCollection";
import VerificationRequest from "@models/VerificationRequest";
import CredentialsVersions from "@models/Credential/versions";

import { withNavBar } from "@popup/components/common/NavBar";
import Button from "@popup/components/common/Button";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import Icon, { IconNames } from "@popup/components/common/Icon";
import TopComponent from "@popup/components/common/TopComponent";
import RequestIcon from "@popup/components/common/RequestIcon";
import CheckboxInput from "@popup/components/common/CheckboxInput";
import RadioInput from "@popup/components/common/RadioInput";
import LevelIcon, { LevelIconSizes } from "@popup/components/common/LevelIcon";

import {
  IAttestedClaim,
  ICredential,
  ISelfAttestedClaim,
} from "@pluginTypes/plugin";

import { fromSnackCase } from "@utils/FormatUtils";

const HeaderContainer = styled.div`
  padding: var(--s-24) 0px;
`;

const TitleContainer = styled.div`
  padding: var(--s-8) 0px;
`;

const SelectContainer = styled.div`
  margin-bottom: var(--s-32);
`;

const CredentialContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;

  margin-left: var(--s-8);
`;

const SelectCredential = styled.div`
  padding: var(--s-20) var(--s-12);
  display: flex;
  align-items: center;

  :not(:last-child) {
    border-bottom: 1px solid rgb(19, 44, 83, 0.2);
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const CollapseButtonContainer = styled.div`
  cursor: pointer;
  position: absolute;
  top: var(--s-24);
  right: var(--s-24);
`;

const SelectedCredential = styled.div`
  position: relative;
  padding: var(--s-20) var(--s-12);

  border-bottom: 1px solid rgb(19, 44, 83, 0.2);
`;

const ActionsContainer = styled.div`
  display: flex;
`;

const ActionContainer = styled.div`
  flex: 1;

  :last-child {
    margin-left: var(--s-20);
  }

  > * {
    width: 100%;
  }
`;

const LabelContainer = styled.div`
  opacity: 0.6;
  margin-bottom: var(--s-12);
  text-transform: uppercase;
`;

const SelectCredentialContainer = styled.div`
  background: var(--c-white);
  border: 1px solid rgba(19, 44, 83, 0.2);
  box-shadow: 0px 8px 12px #061a3a;
  border-radius: var(--s-12);

  color: var(--c-dark-blue);
`;

const SelectPropertiesContainer = styled.div`
  background: var(--c-white);
  border: 1px solid rgba(19, 44, 83, 0.2);
  box-shadow: 0px 8px 12px #061a3a;
  border-radius: var(--s-12);

  color: var(--c-dark-blue);
`;

const SelectedProperties = styled.div`
  padding: var(--s-20) var(--s-12);
`;

const PropertyContainer = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: var(--s-12);

  cursor: pointer;
  user-select: none;

  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`;

const CheckboxContainer = styled.div`
  margin-right: var(--s-8);
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
const AttestedClaimBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  border-radius: var(--s-12);
  padding: var(--s-4) var(--s-12);

  background: var(--c-gray);
`;
const AttestedClaimBadgeName = styled.div`
  opacity: 0.6;
  color: var(--c-blue-dark);
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

export type RequestsProps = {
  requests: RequestsCollection;
  credentials: CredentialsCollection;
  onAccept: (
    id: string,
    credential: ICredential,
    properties: Record<string, boolean>,
  ) => void;
  onDecline: (id: string, credential: ICredential) => void;
};

export type AttestedClaimProps = {
  credential: IAttestedClaim;
};

export type SelfAttestedClaimProps = {
  credential: ISelfAttestedClaim;
};

export type CredentialProps = {
  credential: ICredential;
};

function Credential(props: CredentialProps & React.HTMLProps<HTMLDivElement>) {
  const { credential } = props;

  if (credential.version === CredentialsVersions.VERSION_TWO)
    return <SelfAttestedClaim credential={credential as ISelfAttestedClaim} />;
  else return <AttestedClaim credential={credential as IAttestedClaim} />;
}

function AttestedClaim(
  props: AttestedClaimProps & React.HTMLProps<HTMLDivElement>,
) {
  const { credential } = props;

  const {
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

  const addonsStr = addons.join(" + ");

  if (level === "basic") {
    levelName = `ID Basic + ${addonsStr}`;
  } else {
    levelName = `ID Plus + ${addonsStr}`;
  }

  return (
    <CredentialContainer>
      <LevelIconContainer>
        <LevelIcon level={level} size={LevelIconSizes.SMALL} />
      </LevelIconContainer>
      <CredentialWrapper>
        <LevelStatusContainer>
          <LevelContainer>
            <Text height={TextHeights.LARGE} weight={TextWeights.BOLD}>
              {levelName}
            </Text>
          </LevelContainer>
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
            <AttestedClaimBadge>
              <AttestedClaimBadgeName>
                <Text
                  size={TextSizes.SMALL}
                  height={TextHeights.SMALL}
                  weight={TextWeights.SEMIBOLD}
                >
                  Legacy
                </Text>
              </AttestedClaimBadgeName>
            </AttestedClaimBadge>
          </BadgesContainer>
        </NameBadgesContainer>
      </CredentialWrapper>
    </CredentialContainer>
  );
}

function SelfAttestedClaim(
  props: SelfAttestedClaimProps & React.HTMLProps<HTMLDivElement>,
) {
  const { credential } = props;

  const {
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

  const addonsStr = addons.join(" + ");

  if (level === "basic") {
    levelName = `ID Basic + ${addonsStr}`;
  } else {
    levelName = `ID Plus + ${addonsStr}`;
  }

  return (
    <CredentialContainer>
      <LevelIconContainer>
        <LevelIcon level={level} size={LevelIconSizes.SMALL} />
      </LevelIconContainer>
      <CredentialWrapper>
        <LevelStatusContainer>
          <LevelContainer>
            <Text height={TextHeights.LARGE} weight={TextWeights.BOLD}>
              {levelName}
            </Text>
          </LevelContainer>
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
        </NameBadgesContainer>
      </CredentialWrapper>
    </CredentialContainer>
  );
}

function Requests(props: RequestsProps) {
  const { requests, credentials, onAccept, onDecline } = props;

  const [request] = requests;
  const verificationRequest = request.request as VerificationRequest;
  const requester = request.requester;

  const [selectedCredentialId, setSelectedCredentialId] = useState<string>();
  const [selectedCredential, setSelectedCredential] = useState<ICredential>();
  const [selectedProperties, setSelectedProperties] = useState<
    Record<string, boolean>
  >({});

  const resetSelectedCredential = () => {
    setSelectedCredentialId(undefined);
    setSelectedCredential(undefined);
    setSelectedProperties({});
  };

  const selectCredential = (credentialId: string) => {
    const selected = credentials.find(({ id }) => id === credentialId)!;
    setSelectedCredentialId(selected.id);
    setSelectedCredential(selected);
    setSelectedProperties(
      Object.keys(verificationRequest.fields).reduce(
        (memo, property) => ({
          ...memo,
          [property]: verificationRequest.fields[property] === true,
        }),
        {},
      ),
    );
  };

  const selectProperty = (property: string) => {
    if (!verificationRequest.fields[property]) {
      setSelectedProperties({
        ...selectedProperties,
        [property]: !selectedProperties[property],
      });
    }
  };

  const onChangeRadio = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => selectCredential(value);

  const onChangeCheckbox = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => selectProperty(value);

  const hasFields = Object.keys(verificationRequest.fields).length > 0;
  const hasCredentialSelected = selectedCredential !== undefined;

  const filteredCredentials = credentials.filterByField(
    "level",
    verificationRequest.level,
  );
  const hasMultipleCredentials = filteredCredentials.length > 1;

  if (!hasMultipleCredentials && !hasCredentialSelected) {
    selectCredential(filteredCredentials[0].id);
  }

  return (
    <TopComponent>
      <HeaderContainer>
        <RequestIcon requester={requester.icon} />
      </HeaderContainer>
      <TitleContainer>
        <Title>
          {`${requester.name} is asking permission to access some information:`}
        </Title>
      </TitleContainer>
      <SelectContainer>
        {hasCredentialSelected && (
          <SelectPropertiesContainer>
            <SelectedCredential>
              <LeftContainer>
                <RadioInput checked />
                <Credential credential={selectedCredential!} />
              </LeftContainer>
              {hasMultipleCredentials && (
                <CollapseButtonContainer onClick={resetSelectedCredential}>
                  <Icon name={IconNames.CHEVRON_DOWN} />
                </CollapseButtonContainer>
              )}
            </SelectedCredential>
            {hasFields && (
              <SelectedProperties>
                {Object.keys(selectedProperties).map((propertyKey) => (
                  <PropertyContainer
                    key={propertyKey}
                    disabled={verificationRequest.fields[propertyKey]}
                    onClick={() => selectProperty(propertyKey)}
                  >
                    <CheckboxContainer>
                      <CheckboxInput
                        name="credential"
                        value={propertyKey}
                        checked={selectedProperties[propertyKey]}
                        disabled={verificationRequest.fields[propertyKey]}
                        onChange={onChangeCheckbox}
                      />
                    </CheckboxContainer>
                    <Text key={propertyKey}>{fromSnackCase(propertyKey)}</Text>
                  </PropertyContainer>
                ))}
              </SelectedProperties>
            )}
          </SelectPropertiesContainer>
        )}
        {!hasCredentialSelected && (
          <>
            <LabelContainer>
              <Text>Select Credential</Text>
            </LabelContainer>
            <SelectCredentialContainer>
              {filteredCredentials.map((credential) => (
                <SelectCredential key={credential.id}>
                  <RadioInput
                    name="credential"
                    value={credential.id}
                    checked={selectedCredentialId === credential.id}
                    onChange={onChangeRadio}
                  />
                  <Credential credential={credential} />
                </SelectCredential>
              ))}
            </SelectCredentialContainer>
          </>
        )}
      </SelectContainer>
      <ActionsContainer>
        <ActionContainer>
          <Button
            alternative
            onClick={() =>
              onDecline(
                request.id,
                selectedCredential || filteredCredentials[0],
              )
            }
          >
            Deny
          </Button>
        </ActionContainer>
        <ActionContainer>
          <Button
            disabled={!hasCredentialSelected}
            onClick={() =>
              onAccept(request.id, selectedCredential!, selectedProperties)
            }
          >
            Allow
          </Button>
        </ActionContainer>
      </ActionsContainer>
    </TopComponent>
  );
}

export default withNavBar(Requests);
