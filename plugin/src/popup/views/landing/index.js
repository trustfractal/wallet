import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import appActions from "@redux/app";

import "@popup/styles.css";

function Landing() {
  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();

  const { from } = location.state || { from: { pathname: "/" } };
  const setup = async () => {
    dispatch(appActions.setSignIn(true)).then(() => history.replace(from));
  };

  return (
    <div className="Popup">
      <h2>
        <center>Welcome</center>
      </h2>
      <div>
        <p>Press the below button to setup the plugin.</p>
      </div>
      <button onClick={setup}>Setup</button>
    </div>
  );
}

export default Landing;
