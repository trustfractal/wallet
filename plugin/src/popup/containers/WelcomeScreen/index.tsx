import { useHistory } from "react-router-dom";

import Welcome from "@popup/components/Welcome";

import "@popup/styles.css";

function WelcomeScreen() {
  const history = useHistory();

  const onNext = () => history.push("/wallet-setup");

  return <Welcome onNext={onNext} />;
}

export default WelcomeScreen;
