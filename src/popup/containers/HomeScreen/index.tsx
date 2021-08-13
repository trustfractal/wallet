import { withNavBar } from "@popup/components/common/NavBar";
import Tabs from "@popup/components/common/Tabs";
import Protocol from "@popup/components/Protocol";

import { useAppSelector } from "@redux/stores/application/context";
import { getProtocolEnabled } from "@redux/stores/application/reducers/app/selectors";

interface HomeScreenProps {
  credentials: (props: any) => JSX.Element;
}

function HomeScreen({ credentials }: HomeScreenProps) {
  const protocolEnabled = useAppSelector(getProtocolEnabled);

  const tabs = [
    {
      id: "credentials-tab",
      label: "Credentials",
      props: {},
      component: credentials,
    },
    {
      id: "protocol-tab",
      label: "Protocol",
      props: {},
      component: Protocol,
      disabled: !protocolEnabled,
    },
  ];

  return <Tabs tabs={tabs} />;
}

export default withNavBar(HomeScreen);
