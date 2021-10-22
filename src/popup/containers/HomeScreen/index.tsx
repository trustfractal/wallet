import { useLoadedState, useCachedState } from "@utils/ReactHooks";

import { ActivityStack } from "@popup/containers/ActivityStack";
import { withNavBar } from "@popup/components/common/NavBar";
import Tabs from "@popup/components/common/Tabs";
import { Protocol } from "@popup/components/Protocol";
import Credentials from "@popup/components/Credentials";
import {
  getStorageService,
  getMaguroService,
  getValueCache,
} from "@services/Factory";

function HomeScreen() {
  const protocolEnabled = useCachedState({
    cache: getValueCache(),
    key: "protocol-enabled",
    loader: async () => {
      const config = await getMaguroService().getConfig();
      return config.network === "mainnet";
    },
  });

  const latestTab = useLoadedState(
    async () => await getStorageService().getItem("$latest-tab"),
  );
  const saveLatestTab = async (tab: string) => {
    await getStorageService().setItem("$latest-tab", tab);
    latestTab.setValue(tab);
  };

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
      disabled: !protocolEnabled.unwrapOrDefault(false),
    },
  ];

  return (
    <ActivityStack>
      <Tabs
        tabs={tabs}
        activeTab={latestTab.unwrapOrDefault(undefined)}
        onTabChange={saveLatestTab}
      />
    </ActivityStack>
  );
}

export default withNavBar(HomeScreen);
