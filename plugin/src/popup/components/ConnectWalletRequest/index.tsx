import Button from "@popup/components/common/Button";
import Text from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/TopComponent";

export type ConnectWalletRequestProps = {
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
    <TopComponent>
      <Title>Connect to the wallet where you have your FCL tokens.</Title>
      <div>
        <Text>
          You’ll be prompted to give Fractal permission to access your wallet,
          which is required to pay for your credentials, as well as access the
          staking program.
        </Text>
        <br />
        {hasError && <Text>{error}</Text>}
      </div>
      <Button loading={loading} onClick={onNext}>
        Connect my wallet
      </Button>
    </TopComponent>
  );
}

export default ConnectWalletRequest;
