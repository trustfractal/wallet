import { useUserSelector } from "@redux/stores/user/context";

import Tabs from "@popup/components/common/Tabs";
import Credentials from "@popup/components/Credentials";
import Protocol from "@popup/components/Protocol";
import { withNavBar } from "@popup/components/common/NavBar";

import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import { getRequests } from "@redux/stores/user/reducers/requests/selectors";

function Home() {
  const requests = useUserSelector(getRequests);
  const credentials = useUserSelector(getCredentials);

  const tabs = [
    {
      id: "credentials-tab",
      label: "Credentials",
      props: { credentials, requests },
      component: Credentials,
    },
    {
      id: "protocol-tab",
      label: "Protocol",
      props: {},
      component: Protocol,
    },
  ];

  return <Tabs tabs={tabs} />;
}

export default withNavBar(Home);
