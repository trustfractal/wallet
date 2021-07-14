import {
  ICredential,
  ISelfAttestedClaim,
  IAttestedClaim,
} from "@pluginTypes/index";

import SelfAttestedClaim from "./SelfAttestedClaim";
import AttestedClaim from "./AttestedClaim";
import CredentialsVersions from "@models/Credential/versions";

export type CredentialProps = {
  credential: ICredential;
};

function Credential(props: CredentialProps & React.HTMLProps<HTMLDivElement>) {
  const { credential } = props;

  if (credential.version === CredentialsVersions.VERSION_TWO)
    return <SelfAttestedClaim credential={credential as ISelfAttestedClaim} />;
  else return <AttestedClaim credential={credential as IAttestedClaim} />;
}

export default Credential;
