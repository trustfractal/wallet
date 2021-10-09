import { useState } from "react";
import styled from "styled-components";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import { getWindowsService } from "@services/Factory";
import environment from "@environment/index";

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
  error: string;
};

const MIN_LENGTH = 8;

export function passwordError(password: string): string | undefined {
  if (password.length < MIN_LENGTH)
    return `Must be at least ${MIN_LENGTH} characters`;
  return;
}

function confirmError(password: string, confirm: string): string | undefined {
  if (confirm !== password) return "Password does not match";
  return;
}

function Register({ loading, onNext }: RegisterProps) {
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");

  const newErr = passwordError(newPassword);
  const confirmErr = confirmError(newPassword, confirm);

  const valid = newErr == null && confirmErr == null;

  const onClick = () => {
    if (!valid || loading) return;
    onNext(newPassword);
  };

  return (
    <TopComponent>
      <RootContainer>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <HeaderContainer>
          <Title>Welcome to the Fractal Wallet</Title>
          <Text center>Start by choosing a password</Text>
        </HeaderContainer>
        <InputsContainer>
          <InputContainer>
            <PasswordInput
              id="new_password"
              name="value"
              label="Password"
              error={newErr}
              minLength={MIN_LENGTH}
              value={newPassword}
              onChange={(event) => setNew(event.target.value)}
              onEnter={onClick}
              defaultVisible
              autoFocus
            />
            {newErr == null && (
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
              error={confirmErr}
              minLength={MIN_LENGTH}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              onEnter={onClick}
              defaultVisible
            />
            {confirmErr == null && (
              <CheckContainer>
                <Icon name={IconNames.CHECK} />
              </CheckContainer>
            )}
          </InputContainer>
        </InputsContainer>
        <SwitchTransition>
          <CSSTransition
            key={valid ? "submit-button" : "password-note"}
            addEndListener={(node, done) =>
              node.addEventListener("transitionend", done, false)
            }
            classNames="fade"
          >
            <div>
              {valid ? (
                <ActionContainer>
                  <Button onClick={onClick} loading={loading} disabled={!valid}>
                    Save my password
                  </Button>
                </ActionContainer>
              ) : (
                <PasswordNote />
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </RootContainer>
    </TopComponent>
  );
}

const NoteContainer = styled.div`
  display: flex;
  flex-direction: column;

  *:not(:last-child) {
    margin-bottom: 8px;
  }
`;

function PasswordNote() {
  return (
    <NoteContainer>
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
        . Please keep it safe: Fractal does not have access to it.
      </Text>
      <Text
        size={TextSizes.SMALL}
        height={TextHeights.SMALL}
        weight={TextWeights.BOLD}
      >
        If you forget your password, you’ll lose the ability to use the wallet.
      </Text>
      <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
        By creating a wallet, you agree to our{" "}
        <InlineLink
          onClick={() =>
            getWindowsService().createTab({
              url: `${environment.FRACTAL_WEBSITE_URL}/documents/end-user-agreement`,
            })
          }
        >
          Terms
        </InlineLink>{" "}
        and{" "}
        <InlineLink
          onClick={() =>
            getWindowsService().createTab({
              url: `${environment.FRACTAL_WEBSITE_URL}/documents/privacy-policy`,
            })
          }
        >
          Privacy Policy
        </InlineLink>
        .
      </Text>
    </NoteContainer>
  );
}

function InlineLink({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      size={TextSizes.SMALL}
      height={TextHeights.SMALL}
      weight={TextWeights.NORMAL}
      onClick={onClick}
      span
    >
      {children}
    </Link>
  );
}

export default withNavBar(Register, false);
