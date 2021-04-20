import Button from "@popup/components/Button";

import "@popup/styles.css";

type ConnectWalletRequestProps = {
  loading: boolean;
  onNext: () => void;
  error: string;
};

ConnectWalletRequest.defaultProps = {
  error: "",
};

function ConnectWalletRequest(props: ConnectWalletRequestProps) {
  const { loading, error, onNext } = props;

  const hasError = error.length > 0;

  return (
    <div className="Popup">
      <h2>Connect to the wallet where you have your FCL tokens.</h2>
      <div>
        <p>
          You’ll be prompted to give Fractal permission to access your wallet,
          which is required to pay for your credentials, as well as access the
          staking program.
        </p>
        <br />
        {hasError && <p>{error}</p>}
      </div>
      <Button loading={loading} onClick={onNext}>
        Connect my wallet
      </Button>
    </div>
  );
}

export default ConnectWalletRequest;
