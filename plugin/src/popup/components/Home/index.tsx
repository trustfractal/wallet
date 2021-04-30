import { ICredential } from "@fractalwallet/types";

import Tabs from "@popup/components/common/Tabs";
import { withNavBar } from "@popup/components/common/NavBar";
import Staking from "@popup/components/Staking";
import Credentials from "@popup/components/Credentials";
import { useState } from "react";

export type HomeProps = {
  account: string;
  credentials: ICredential[];
};

enum TabsNames {
  STAKING = "staking",
  CREDENTIALS = "credentials",
}

function Home(props: HomeProps) {
  const { account, credentials } = props;

  const tabs = {
    [TabsNames.CREDENTIALS]: {
      id: "credentials-tab",
      label: "Credentials",
    },
    [TabsNames.STAKING]: {
      id: "staking-tab",
      label: "Staking",
    },
  };

  const [selected, setSelected] = useState(tabs[TabsNames.CREDENTIALS].id);

  return (
    <Tabs
      tabs={Object.values(tabs)}
      selected={selected}
      setSelected={setSelected}
    >
      {selected === tabs[TabsNames.CREDENTIALS].id ? (
        <Credentials credentials={credentials} />
      ) : (
        <Staking />
      )}
    </Tabs>
  );
}

export default withNavBar(Home);
