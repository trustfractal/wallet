import { useState } from "react";

import Button from "@popup/components/common/Button";
import Input from "@popup/components/common/Input";
import Text from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/TopComponent";

export type LoginProps = {
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
    <TopComponent>
      <Title>Enter your password to login</Title>
      <div>
        <Input
          id="password"
          name="value"
          placeholder="Password"
          type="password"
          value={password}
          onChange={onChangePassword}
        />
        <br />
        {hasError && <Text>{error}</Text>}
      </div>
      <Button onClick={onClick} loading={loading} disabled={isPasswordEmpty}>
        Login
      </Button>
    </TopComponent>
  );
}

export default Login;
