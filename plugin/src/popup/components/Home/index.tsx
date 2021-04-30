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

function Home(props: HomeProps) {
  const { account, credentials } = props;

  const tabs = [
    {
      id: "credentials-tab",
      label: "Credentials",
    },
    {
      id: "staking-tab",
      label: "Staking",
    },
  ];

  const [selected, setSelected] = useState(tabs[0].id);

  return (
    <Tabs tabs={tabs} selected={selected} setSelected={setSelected}>
      {selected === "credentials-tab" ? (
        <Credentials credentials={credentials} />
      ) : (
        <Staking />
      )}
    </Tabs>
  );
}

export default withNavBar(Home);
