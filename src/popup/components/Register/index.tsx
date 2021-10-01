import { useState } from "react";
import styled from "styled-components";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import Button from "@popup/components/common/Button";
import PasswordInput from "@popup/components/common/PasswordInput";
import Text, {
  TextSizes,
  TextHeights,
  TextWeights,
} from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/common/TopComponent";
import Icon, { IconNames } from "@popup/components/common/Icon";
import Logo from "@popup/components/common/Logo";
import Link from "@popup/components/common/Link";

import { withNavBar } from "@popup/components/common/NavBar";

const RootContainer = styled.div`
  padding: var(--s-24) 0px;
  .fade-enter {
    opacity: 0;
  }
  .fade-exit {
    opacity: 1;
  }
  .fade-enter-active {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-exit-active {
    transition: opacity 0.2s;
  }
`;
const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: var(--s-48);
`;
const HeaderContainer = styled.div`
  margin-bottom: var(--s-24);
`;
const InputsContainer = styled.div`
  margin-bottom: var(--s-8);
`;
const InputContainer = styled.div`
  height: calc(
    ${TextHeights.SMALL} + var(--s-5) + ${TextHeights.MEDIUM} + var(--s-12) +
      ${TextHeights.SMALL} + ${TextHeights.SMALL}
  );
  margin-bottom: var(--s-26);
`;
const CheckContainer = styled.div`
  margin-top: var(--s-12);
`;
const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type RegisterProps = {
  loading: boolean;
  onNext: (password: string) => void;
  onClickTerms: () => void;
  onClickPrivacyPolicy: () => void;
  error: string;
};

function Register(props: RegisterProps) {
  const { loading, onNext, onClickTerms, onClickPrivacyPolicy } = props;

  const minLength = 8;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hint, setHint] = useState(`Minimum length: ${minLength}`);

  const onClick = () => {
    if (arePasswordsValidAndEquals && !loading) {
      onNext(newPassword);
    }
  };

  const isNewPasswordEmpty = newPassword.length === 0;
  const isConfirmPasswordEmpty = confirmPassword.length === 0;
  const isNewPasswordValid = newPassword.length >= minLength;
  const isConfirmPasswordValid = confirmPassword.length >= minLength;
  const arePasswordsValid =
    !isNewPasswordEmpty &&
    isNewPasswordValid &&
    !isConfirmPasswordEmpty &&
    isConfirmPasswordValid;
  const arePasswordsEquals = newPassword === confirmPassword;
  const arePasswordsValidAndEquals = arePasswordsValid && arePasswordsEquals;

  const onChangeNewPassword = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(value);

    if (value.length > 0) {
      setHint("");
      return;
    }

    setHint(`Minimum length: ${minLength}`);
  };
  const onChangeConfirmPassword = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(value);
  };

  return (
    <TopComponent>
      <RootContainer>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <HeaderContainer>
          <Title>Welcome to the Fractal Wallet</Title>
          <Text>Please start by choosing a password</Text>
        </HeaderContainer>
        <InputsContainer>
          <InputContainer>
            <PasswordInput
              id="new_password"
              name="value"
              label="Choose a password"
              hint={hint}
              minLength={minLength}
              value={newPassword}
              onChange={onChangeNewPassword}
              onEnter={onClick}
              defaultVisible
            />
            {isNewPasswordValid && (
              <CheckContainer>
                <Icon name={IconNames.CHECK} />
              </CheckContainer>
            )}
          </InputContainer>
          <InputContainer>
            <PasswordInput
              id="confirm_password"
              name="value"
              label="Confirm Password"
              minLength={minLength}
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
              onEnter={onClick}
              defaultVisible
            />
            {arePasswordsValidAndEquals && (
              <CheckContainer>
                <Icon name={IconNames.CHECK} />
              </CheckContainer>
            )}
          </InputContainer>
        </InputsContainer>
        <SwitchTransition>
          <CSSTransition
            key={arePasswordsValid ? "submit-button" : "password-note"}
            addEndListener={(node, done) =>
              node.addEventListener("transitionend", done, false)
            }
            classNames="fade"
          >
            <div>
              {arePasswordsValid && (
                <ActionContainer>
                  <Button
                    onClick={onClick}
                    loading={loading}
                    disabled={!arePasswordsValidAndEquals}
                  >
                    Save my password
                  </Button>
                </ActionContainer>
              )}
              {!arePasswordsValid && (
                <>
                  <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                    Note
                  </Text>
                  <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                    Your password is used to unlock{" "}
                    <Text
                      size={TextSizes.SMALL}
                      height={TextHeights.SMALL}
                      weight={TextWeights.BOLD}
                      span
                    >
                      your Fractal Wallet
                    </Text>
                    . Please keep it safe: Fractal doesn't have access to it.
                  </Text>
                  <Text size={TextSizes.SMALL}>
                    <br />
                  </Text>
                  <Text
                    size={TextSizes.SMALL}
                    height={TextHeights.SMALL}
                    weight={TextWeights.BOLD}
                  >
                    If you forget your password, you’ll lose the ability to use
                    the wallet.
                  </Text>
                  <Text size={TextSizes.SMALL}>
                    <br />
                  </Text>
                  <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
                    By creating a wallet, you agree to our{" "}
                    <Link
                      size={TextSizes.SMALL}
                      height={TextHeights.SMALL}
                      weight={TextWeights.NORMAL}
                      onClick={onClickTerms}
                      span
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      size={TextSizes.SMALL}
                      height={TextHeights.SMALL}
                      weight={TextWeights.NORMAL}
                      span
                      onClick={onClickPrivacyPolicy}
                    >
                      Privacy Policy
                    </Link>
                    .
                  </Text>
                </>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </RootContainer>
    </TopComponent>
  );
}

export default withNavBar(Register, false);
