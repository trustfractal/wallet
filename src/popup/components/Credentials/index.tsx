import { ICredential } from "@pluginTypes/index";

import Credential from "@popup/components/common/Credential";
import TopComponent from "@popup/components/common/TopComponent";

export type CredentialsProps = {
  credentials: ICredential[];
};

export type CredentialProps = {
  credential: ICredential;
};

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
