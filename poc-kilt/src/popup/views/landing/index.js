import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import kiltActions from "@redux/kilt";

import "@popup/styles.css";

function Landing() {
  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();

  const { from } = location.state || { from: { pathname: "/" } };
  const handleClick = async () => {
    dispatch(kiltActions.generateIdentity()).then(() => history.replace(from));
  };

  return (
    <div className="Popup">
      <h2>
        <center>Welcome</center>
      </h2>
      <div>
        <p>Press the below button to setup a kilt identity.</p>
      </div>
      <button onClick={handleClick}>Setup</button>
    </div>
  );
}

export default Landing;
