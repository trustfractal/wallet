import { ICredential } from "@fractalwallet/types";

import Tabs from "@popup/components/common/Tabs";
import { withNavBar } from "@popup/components/common/NavBar";
import Staking from "@popup/components/Credentials";
import Credentials from "@popup/components/Credentials";

export type HomeProps = {
  account: string;
  credentials: ICredential[];
};

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
