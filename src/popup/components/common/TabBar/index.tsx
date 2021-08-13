import Tabs from "@popup/components/common/Tabs";
import Credentials from "@popup/components/Credentials";
import Protocol from "@popup/components/Protocol";

import { useAppSelector } from "@redux/stores/application/context";
import { getProtocolEnabled } from "@redux/stores/application/reducers/app/selectors";

interface Tab {
  id: string;
  label: string;
  props: any;
  component: (props: any) => JSX.Element;
  disabled?: boolean;
}

interface TabBarProps {
  tabs?: Tab[];
}

const defaultTabs = ({ protocolEnabled }: Record<string, any>): Tab[] => [
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

function TabBar({ tabs: tabsOverride }: TabBarProps) {
  const protocolEnabled = useAppSelector(getProtocolEnabled);

  const tabs = tabsOverride || defaultTabs({ protocolEnabled });

  return <Tabs tabs={tabs} />;
}

export default TabBar;
