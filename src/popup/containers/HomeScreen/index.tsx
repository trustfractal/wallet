import { withNavBar } from "@popup/components/common/NavBar";
import TabBar from "@popup/components/common/TabBar";

function Home() {
  return <TabBar />;
}

export default withNavBar(Home);
