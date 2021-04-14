import Button from "@popup/components/Button";

import "@popup/styles.css";

type WelcomeProps = {
  onNext: () => void;
};

function Welcome(props: WelcomeProps) {
  const { onNext } = props;

  return (
    <div className="Popup">
      <h2>Welcome</h2>
      <div>
        <p>Press the below button to start the plugin setup.</p>
      </div>
      <Button onClick={onNext}>Next</Button>
    </div>
  );
}

export default Welcome;
