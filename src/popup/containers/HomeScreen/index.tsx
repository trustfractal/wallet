import { useEffect, useState } from "react";

import { withNavBar } from "@popup/components/common/NavBar";
import Tabs from "@popup/components/common/Tabs";
import Protocol from "@popup/components/Protocol";
import MaguroService from "@services/MaguroService";

interface HomeScreenProps {
  credentials: (props: any) => JSX.Element;
}

function HomeScreen({ credentials }: HomeScreenProps) {
  const [protocolEnabled, setProtocolEnabled] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (protocolEnabled) return;

      const config = await MaguroService.getConfig();
      setProtocolEnabled(config.protocol_enabled);
    })();
  });

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
