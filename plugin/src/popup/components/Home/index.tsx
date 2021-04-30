import { useState } from "react";

import { ICredential } from "@fractalwallet/types";

import { useUserSelector } from "@redux/stores/user/context";
import {
  getStakingDetails,
  getStakingStatus,
} from "@redux/stores/user/reducers/wallet/selectors";

import Tabs from "@popup/components/common/Tabs";
import Staking from "@popup/components/Staking";
import Credentials from "@popup/components/Credentials";
import { withNavBar } from "@popup/components/common/NavBar";

export type HomeProps = {
  credentials: ICredential[];
  onClick: () => void;
};

enum TabsNames {
  STAKING = "staking",
  CREDENTIALS = "credentials",
}

function Home(props: HomeProps) {
  const { credentials, onClick } = props;

  const stakingDetails: any = useUserSelector(getStakingDetails);
  const stakingStatus: any = useUserSelector(getStakingStatus);

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
        <Staking
          stakingDetails={stakingDetails}
          stakingStatus={stakingStatus}
          onClick={onClick}
        />
      )}
    </Tabs>
  );
}

export default withNavBar(Home);
