import { useState } from "react";

import Button from "@popup/components/Button";

import "@popup/styles.css";

type RegisterProps = {
  loading: boolean;
  onNext: (password: string) => void;
  error: string;
};

function Register(props: RegisterProps) {
  const { loading, onNext, error: propError } = props;

  const [passwordError, setPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onClick = () => {
    if (ensurePasswordsAreEquals()) {
      onNext(newPassword);
    }
  };

  const error = passwordError.length > 0 ? passwordError : propError;
  const hasError = error.length > 0;
  const arePasswordsEmpty =
    newPassword.length === 0 || confirmPassword.length === 0;

  const onChangeNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordError("");
    setNewPassword(event.target.value);
  };
  const onChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordError("");
    setConfirmPassword(event.target.value);
  };

  const ensurePasswordsAreEquals = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Error: Passwords don't match!");
      return false;
    }

    return true;
  };

  return (
    <div className="Popup">
      <h2>Welcome to the Fractal Identity Wallet</h2>
      <p>Please start by creating your password</p>
      <div>
        <label htmlFor="new_password" />
        <input
          id="new_password"
          name="value"
          placeholder="Enter a password"
          type="password"
          value={newPassword}
          onChange={onChangeNewPassword}
        />
        <br />
        <label htmlFor="confirm_password" />
        <input
          id="confirm_password"
          name="value"
          placeholder="Confirm the password"
          type="password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          onBlur={ensurePasswordsAreEquals}
        />
        <br />
        {hasError && <p>{error}</p>}
      </div>
      <Button onClick={onClick} loading={loading} disabled={arePasswordsEmpty}>
        Save my password
      </Button>
    </div>
  );
}

export default Register;
