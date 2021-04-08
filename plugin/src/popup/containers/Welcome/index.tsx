import { useHistory } from "react-router-dom";

import "@popup/styles.css";

function Welcome() {
  const history = useHistory();

  const onClickNext = () => history.push("/password-setup");

  return (
    <div className="Popup">
      <h2>Welcome</h2>
      <div>
        <p>Press the below button to start the plugin setup.</p>
      </div>
      <button onClick={onClickNext}>Next</button>
    </div>
  );
}

export default Welcome;
