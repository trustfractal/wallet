import Button from "@popup/components/Button";

import "@popup/styles.css";

type WalletSetupProps = {
  account: string;
  loading: boolean;
  onNext: () => void;
  onSetup: () => void;
  error: string;
};

WalletSetup.defaultProps = {
  error: "",
};

function WalletSetup(props: WalletSetupProps) {
  const { account, loading, error, onSetup, onNext } = props;

  const hasAccount = account.length > 0;
  const hasError = error.length > 0;

  console.log(account);

  return (
    <div className="Popup">
      <h2>Ethereum Wallet Detected!</h2>
      <div>
        <p>Press the below button to setup a connection to your wallet.</p>
        <p>You'll be asked to grant accounts address read permissions.</p>
        <br />
        {error.length > 0 && <p>{error}</p>}
      </div>
      <Button loading={loading} onClick={onSetup}>
        Setup
      </Button>
      {!loading && !hasError && hasAccount && (
        <>
          <div>
            <p>{`We detected this account address: ${account}.`}</p>
            <p>Please press next to continue</p>
            <p>
              If this is not the desired address, please select the correct one
              in your browser wallet extension and click the above setup button
              to try again.
            </p>
            <br />
            {error.length > 0 && <p>{error}</p>}
          </div>
          <Button loading={loading} onClick={onNext}>
            Next
          </Button>
        </>
      )}
    </div>
  );
}

export default WalletSetup;
