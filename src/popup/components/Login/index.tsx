import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@popup/components/common/Button";
import PasswordInput from "@popup/components/common/PasswordInput";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/common/TopComponent";
import Logo from "@popup/components/common/Logo";
import Anchor from "@popup/components/common/Anchor";
import Text, { TextSizes, TextHeights } from "@popup/components/common/Text";

const RootContainer = styled.div`
  padding-top: var(--s-24);
`;
const LogoContainer = styled.div`
  display: flex;
  justify-content: center;

  margin-bottom: var(--s-48);
`;
const HeaderContainer = styled.div`
  margin-bottom: var(--s-24);
`;
const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  margin: var(--s-32) 0px;
`;

const FooterContainer = styled.div``;

const InputContainer = styled.div`
  height: calc(
    ${TextHeights.SMALL} + var(--s-5) + ${TextHeights.MEDIUM} + var(--s-12)
  );
  margin-bottom: var(--s-26);
`;

export type LoginProps = {
  loading: boolean;
  onNext: (password: string) => void;
  error: string;
};

function Login(props: LoginProps) {
  const { loading, onNext, error: propError } = props;

  const [password, setPassword] = useState("");
  const [error, setError] = useState(propError);

  const onClick = () => {
    if (loading || isPasswordEmpty || hasError) {
      return;
    }

    onNext(password);
  };

  const hasError = error.length > 0;
  const isPasswordEmpty = password.length === 0;

  const onChangePassword = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setPassword(value);
  };

  useEffect(() => setError(propError), [propError]);

  return (
    <TopComponent>
      <RootContainer>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <HeaderContainer>
          <Title>Enter your password to login</Title>
        </HeaderContainer>
        <InputContainer>
          <PasswordInput
            id="password"
            name="value"
            label="Enter your password"
            value={password}
            error={error}
            onChange={onChangePassword}
            onEnter={onClick}
          />
        </InputContainer>
        <ActionsContainer>
          <Button
            onClick={onClick}
            loading={loading}
            disabled={isPasswordEmpty || hasError}
          >
            Unlock my wallet
          </Button>
        </ActionsContainer>
        <FooterContainer>
          <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
            If you need help on anything related to Fractal ID Wallet, please
            contact us at{" "}
            <Anchor link="mailto:support@fractal.id">support@fractal.id</Anchor>
            .
          </Text>
        </FooterContainer>
      </RootContainer>
    </TopComponent>
  );
}

export default Login;
