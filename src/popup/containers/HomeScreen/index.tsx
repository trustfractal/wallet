import { useEffect, useState } from "react";

import { withNavBar } from "@popup/components/common/NavBar";
import Tabs from "@popup/components/common/Tabs";
import Protocol from "@popup/components/Protocol";
import Credentials from "@popup/components/Credentials";
import { getMaguroService } from "@services/Factory";

import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";
import { getProtocolEnabled } from "@redux/stores/application/reducers/app/selectors";
import appActions from "@redux/stores/application/reducers/app";

function HomeScreen() {
  const protocolEnabledConfig = useAppSelector(getProtocolEnabled);
  const appDispatch = useAppDispatch();

  const [protocolEnabled, setProtocolEnabled] = useState<boolean>(
    protocolEnabledConfig,
  );

  useEffect(() => {
    (async () => {
      if (protocolEnabled) return;

      const config = await getMaguroService().getConfig();
      setProtocolEnabled(config.protocol_enabled);
      appDispatch(appActions.setProtocolEnabled(config.protocol_enabled));
    })();
  });

  const tabs = [
    {
      id: "credentials-tab",
      label: "Credentials",
      props: {},
      component: Credentials,
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
