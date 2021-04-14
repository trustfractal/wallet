import "@popup/styles.css";

function NoWalletDetected() {
  return (
    <div className="Popup">
      <h2>No Wallet Detected!</h2>
      <div>
        <p>
          You are missing an Ethereum Wallet extension (e.g. Metamask). Please
          install one first.
        </p>
      </div>
    </div>
  );
}

export default NoWalletDetected;
