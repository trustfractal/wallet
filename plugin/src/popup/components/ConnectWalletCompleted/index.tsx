import Button from "@popup/components/Button";

import "@popup/styles.css";

type ConnectWalletCompletedProps = {
  account: string;
  onNext: () => void;
};

function ConnectWalletCompleted(props: ConnectWalletCompletedProps) {
  const { account, onNext } = props;

  return (
    <div className="Popup">
      <h2>Fractal is now connected to your wallet</h2>
      <div>
        <p>{`Detected address: ${account}`}</p>
        <br />
      </div>
      <Button onClick={onNext}>Got it</Button>
    </div>
  );
}

export default ConnectWalletCompleted;
