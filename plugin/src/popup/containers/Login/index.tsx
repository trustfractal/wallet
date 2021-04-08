import { useState } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";

import authActions from "@redux/stores/application/reducers/auth";

import {
  getSignInError,
  isSignInLoading,
} from "@redux/stores/application/reducers/auth/selectors";

import "@popup/styles.css";

function Login() {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(isSignInLoading);
  const signIpError = useAppSelector(getSignInError);

  const [password, setPassword] = useState("");

  const onClick = () => dispatch(authActions.signInRequest(password));

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  return (
    <div className="Popup">
      <h2>Welcome back!</h2>
      <div>
        <input
          id="password"
          name="value"
          placeholder="Password"
          type="password"
          value={password}
          onChange={onChangePassword}
        />
        <br />
        {signIpError.length > 0 && <p>{signIpError}</p>}
      </div>
      <button onClick={onClick} disabled={password.length === 0 || isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
