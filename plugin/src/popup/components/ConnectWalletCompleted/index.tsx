import Button from "@popup/components/common/Button";
import Text from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/TopComponent";

export type ConnectWalletCompletedProps = {
  account: string;
  onNext: () => void;
};

function ConnectWalletCompleted(props: ConnectWalletCompletedProps) {
  const { account, onNext } = props;

  return (
    <TopComponent>
      <Title>Fractal is now connected to your wallet</Title>
      <div>
        <Text>{`Detected address: ${account}`}</Text>
        <br />
      </div>
      <Button onClick={onNext}>Got it</Button>
    </TopComponent>
  );
}

export default ConnectWalletCompleted;
