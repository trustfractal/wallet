import { useAppSelector } from "@redux/stores/application/context";
import { useUserSelector } from "@redux/stores/user/context";
import {
  getStakingDetails,
  getStakingStatus,
} from "@redux/stores/user/reducers/wallet/selectors";

import { isStakingEnabled } from "@redux/stores/application/reducers/app/selectors";

import Tabs from "@popup/components/common/Tabs";
import Staking from "@popup/components/Staking";
import Credentials from "@popup/components/Credentials";
import { withNavBar } from "@popup/components/common/NavBar";

import environment from "@environment/index";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import { getRequests } from "@redux/stores/user/reducers/requests/selectors";

import WindowsService from "@services/WindowsService";

function Home() {
  const onClick = () =>
    WindowsService.openTab(`${environment.FRACTAL_WEBSITE_URL}/staking`);

  const requests = useUserSelector(getRequests);
  const credentials = useUserSelector(getCredentials);
  const stakingDetails: any = useUserSelector(getStakingDetails);
  const stakingStatus: any = useUserSelector(getStakingStatus);
  const stakingEnabled: boolean = useAppSelector(isStakingEnabled);

  const tabs = [
    {
      id: "credentials-tab",
      label: "Credentials",
      props: { credentials, requests },
      component: Credentials,
    },
    {
      id: "staking-tab",
      label: "Staking",
      disabled: !stakingEnabled,
      props: {
        stakingDetails,
        stakingStatus,
        onClick,
        disabled: !stakingEnabled,
      },
      component: Staking,
    },
  ];

  return <Tabs tabs={tabs} />;
}

export default withNavBar(Home);
