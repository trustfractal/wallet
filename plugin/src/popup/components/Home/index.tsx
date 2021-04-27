import { ICredential } from "@fractalwallet/types";

import Text from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/TopComponent";

export type HomeProps = {
  account: string;
  credentials: ICredential[];
};

function Home(props: HomeProps) {
  const { account, credentials } = props;

  return (
    <TopComponent>
      <Title>Home</Title>
      <Text>{`Account: ${account}`}</Text>
      <Text>{`Credentials: ${credentials.length}`}</Text>
    </TopComponent>
  );
}

export default Home;
