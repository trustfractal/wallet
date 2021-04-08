import { useState } from "react";
import { useHistory } from "react-router-dom";

import { useAppDispatch } from "@redux/stores/application/context";

import registerActions from "@redux/stores/application/reducers/register";

import "@popup/styles.css";

function PasswordSetup() {
  const dispatch = useAppDispatch();

  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const history = useHistory();

  const onClick = () => {
    if (ensurePasswordsAreEquals()) {
      dispatch(registerActions.setRegisterPassword(newPassword));
      history.push("/wallet-setup");
    }
  };

  const onChangeNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setNewPassword(event.target.value);
  };
  const onChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setError("");
    setConfirmPassword(event.target.value);
  };

  const ensurePasswordsAreEquals = () => {
    if (newPassword !== confirmPassword) {
      setError("Error: Passwords don't match!");
      return false;
    }

    return true;
  };

  return (
    <div className="Popup">
      <h2>Create Password</h2>
      <div>
        <label htmlFor="new_password" />
        <input
          id="new_password"
          name="value"
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={onChangeNewPassword}
        />
        <br />
        <label htmlFor="confirm_password" />
        <input
          id="confirm_password"
          name="value"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          onBlur={ensurePasswordsAreEquals}
        />
        <br />
        <p>{error}</p>
      </div>
      <button
        onClick={onClick}
        disabled={newPassword.length === 0 || error.length !== 0}
      >
        Next
      </button>
    </div>
  );
}

export default PasswordSetup;
