import {
  ICredential,
  IStableCredential,
  ILegacyCredential,
} from "@pluginTypes/index";

import StableCredential from "../StableCredential";
import LegacyCredential from "../LegacyCredential";
import CredentialsVersions from "@models/Credential/versions";

export type CredentialProps = {
  credential: ICredential;
};

function Credential(props: CredentialProps & React.HTMLProps<HTMLDivElement>) {
  const { credential } = props;

  if (credential.version === CredentialsVersions.VERSION_TWO)
    return <StableCredential credential={credential as IStableCredential} />;
  else return <LegacyCredential credential={credential as ILegacyCredential} />;
}

export default Credential;
