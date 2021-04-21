import { ICredential } from "@fractalwallet/types";

import "@popup/styles.css";

type HomeProps = {
  account: string;
  credentials: ICredential[];
};

function Home(props: HomeProps) {
  const { account, credentials } = props;

  return (
    <div className="Popup">
      <h2>Home</h2>
      <p>{`Account: ${account}`}</p>
      <p>{`Credentials: ${credentials.length}`}</p>
    </div>
  );
}

export default Home;
