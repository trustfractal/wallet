import { useHistory } from "react-router-dom";

import "@popup/styles.css";

function NoWalletDetected() {
  const history = useHistory();

  const onClickNext = () => history.push("/wallet-setup");

  return (
    <div className="Popup">
      <h2>No Wallet Detected!</h2>
      <div>
        <p>
          You are missing an Ethereum Wallet extension (e.g. Metamask). Please
          install one first.
        </p>
      </div>
      <button onClick={onClickNext}>Next</button>
    </div>
  );
}

export default NoWalletDetected;
