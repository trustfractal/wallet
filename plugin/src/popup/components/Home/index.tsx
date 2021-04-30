import { ICredential } from "@fractalwallet/types";

import TopComponent from "@popup/components/common/TopComponent";
import Text from "@popup/components/common/Text";
import Tabs from "@popup/components/common/Tabs";
import { withNavBar } from "@popup/components/common/NavBar";

export type HomeProps = {
  account: string;
  credentials: ICredential[];
};

export type CredentialsProps = {
  account: string;
  credentials: ICredential[];
};

export type StakingProps = {};

function Credentials(props: CredentialsProps) {
  return (
    <TopComponent>
      <Text>Credentials</Text>
    </TopComponent>
  );
}

function Staking(props: StakingProps) {
  return (
    <TopComponent>
      <Text>Staking</Text>
    </TopComponent>
  );
}
function Home(props: HomeProps) {
  const { account, credentials } = props;

  const tabs = [
    {
      id: "credentials-tab",
      label: "Credentials",
      props: { credentials },
      component: Credentials,
    },
    {
      id: "staking-tab",
      label: "Staking",
      props: {},
      component: Staking,
    },
  ];

  return <Tabs tabs={tabs} />;
}

export default withNavBar(Home);
