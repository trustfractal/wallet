import { useHistory } from "react-router";
import { Credential as SDKCredential } from "@fractalwallet/sdk";

import Credential from "@models/Credential";
import CredentialsCollection from "@models/Credential/CredentialsCollection";

import Home from "@popup/components/Home";
import EmptyCredentials from "@popup/components/EmptyCredentials";

import { useUserSelector } from "@redux/stores/user/context";
import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";

import RoutesPaths from "@popup/routes/paths";
import { useAppSelector } from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

import WindowsService from "@services/WindowsService";
import environment from "@environment/index";

function HomeScreen() {
  const history = useHistory();

  const account = useUserSelector(getAccount);
  // const credentials = useUserSelector(getCredentials);
  const setup = useAppSelector(isSetup);

  const sdkCredential = new SDKCredential({
    claim: {
      claimTypeHash: "claimTypeHash",
      owner: "owner",
      properties: {
        name: "Diogo",
        age: 25,
      },
    },
    rootHash: "rootHash",
    attesterAddress: "attesterAddress",
    attesterSignature: "attesterSignature",
    credentialHash: "credentialHash",
    credentialSignature: "credentialSignature",
    claimerAddress: "claimerAddress",
    claimerSignature: "claimerSignature",
    claimTypeHash: {
      hash: "hash",
    },
    claimHashTree: {
      name: {
        hash: "hash",
      },
      age: {
        hash: "hash",
      },
    },
  });
  const credential = new Credential(sdkCredential, "dummy");
  const credentials = new CredentialsCollection();
  credentials.push(credential);

  // redirect to wallet connect
  if (!setup) {
    history.push(RoutesPaths.CONNECT_WALLET);
  }

  // check if has credentials
  if (credentials.length === 0) {
    return (
      <EmptyCredentials
        onNext={() =>
          WindowsService.openTab(
            `https://${environment.FRACTAL_WEBSITE_HOSTNAME}/credentials`,
          )
        }
      />
    );
  }

  return <Home account={account} credentials={credentials} />;
}

export default HomeScreen;
