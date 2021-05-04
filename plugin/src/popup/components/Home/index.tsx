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
  onClickPool: () => void;
  onClickEmpty: () => void;
};

function Home(props: HomeProps) {
  const { credentials, onClickPool, onClickEmpty } = props;

  const stakingDetails: any = useUserSelector(getStakingDetails);
  const stakingStatus: any = useUserSelector(getStakingStatus);

  const tabs = [
    {
      id: "credentials-tab",
      label: "Credentials",
      props: { credentials, onClickEmpty },
      component: Credentials,
    },
    {
      id: "staking-tab",
      label: "Staking",
      props: { stakingDetails, stakingStatus, onClickPool },
      component: Staking,
    },
  ];

  return <Tabs tabs={tabs} />;
}

export default withNavBar(Home);
