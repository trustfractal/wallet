import { useState } from "react";

import Button from "@popup/components/Button";

import "@popup/styles.css";

type LoginProps = {
  loading: boolean;
  onNext: (password: string) => void;
  error: string;
};

function Login(props: LoginProps) {
  const { loading, onNext, error } = props;

  const [password, setPassword] = useState("");

  const onClick = () => onNext(password);

  const hasError = error.length > 0;
  const isPasswordEmpty = password.length === 0;

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  return (
    <div className="Popup">
      <h2>Enter your password to login</h2>
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
        {hasError && <p>{error}</p>}
      </div>
      <Button
        onClick={onClick}
        loading={loading}
        disabled={hasError || isPasswordEmpty}
      >
        Login
      </Button>
    </div>
  );
}

export default Login;
