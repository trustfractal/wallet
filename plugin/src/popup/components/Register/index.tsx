import { useState } from "react";

import Button from "@popup/components/common/Button";
import PasswordInput from "@popup/components/common/PasswordInput";
import Text, {
  TextSizes,
  TextHeights,
  TextWeights,
} from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/TopComponent";
import Icon, { IconNames } from "@popup/components/common/Icon";
import Logo from "@popup/components/common/Logo";

export type RegisterProps = {
  loading: boolean;
  onNext: (password: string) => void;
  error: string;
};

function Register(props: RegisterProps) {
  const { loading, onNext } = props;

  const minLength = 8;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hint, setHint] = useState(`Minimum of ${minLength} chars`);

  const onClick = () => onNext(newPassword);

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

    setHint(`Minimum of ${minLength} chars`);
  };
  const onChangeConfirmPassword = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(value);
  };

  return (
    <TopComponent>
      <Logo />
      <Title>Welcome to the Fractal Identity Wallet</Title>
      <Text>Please start by creating your password</Text>
      <div>
        <label htmlFor="new_password" />
        <PasswordInput
          id="new_password"
          name="value"
          label="Create a password"
          hint={hint}
          minLength={minLength}
          value={newPassword}
          onChange={onChangeNewPassword}
        />
        {isNewPasswordValid && <Icon name={IconNames.CHECK} />}
        <label htmlFor="confirm_password" />
        <PasswordInput
          id="confirm_password"
          name="value"
          label="Confirm Password"
          minLength={minLength}
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />
        {arePasswordsValidAndEquals && <Icon name={IconNames.CHECK} />}
      </div>
      {arePasswordsValid && (
        <Button
          onClick={onClick}
          loading={loading}
          disabled={!arePasswordsValidAndEquals}
        >
          Save my password
        </Button>
      )}
      {!arePasswordsValid && (
        <>
          <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
            Note
          </Text>

          <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
            Your password is used to unlock your Fractal ID Wallet and we don’t
            have access to it.
          </Text>

          <Text size={TextSizes.SMALL}>
            <br />
          </Text>

          <Text
            size={TextSizes.SMALL}
            height={TextHeights.SMALL}
            weight={TextWeights.BOLD}
          >
            If you forget your password, you’ll lose the ability to use the
            wallet.
          </Text>
        </>
      )}
    </TopComponent>
  );
}

export default Register;
