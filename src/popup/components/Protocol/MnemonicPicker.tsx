import { mnemonicGenerate } from "@polkadot/util-crypto";

import styled from "styled-components";

import Logo from "@popup/components/common/Logo";
import { Subsubtitle } from "@popup/components/common/Subtitle";
import Button from "@popup/components/common/Button";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const HeaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s-38) 0 var(--s-24);
`;

const Spacing = styled.div<{ size?: string }>`
  margin-bottom: ${(props) => props.size || "var(--s-20)"};
`;

const CTA = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

function HeaderWithLogo() {
  return (
    <HeaderContainer>
      <Logo />
    </HeaderContainer>
  );
}

const Link = styled.a`
  cursor: pointer;
  color: var(--c-orange);
  text-decoration: underline;
`;

export default function MnemonicPicker({
  onMnemonicPicked,
}: {
  onMnemonicPicked: (mnemonic: string) => void;
}) {
  const onCtaClicked = () => {
    onMnemonicPicked(mnemonicGenerate());
  };

  return (
    <Container>
      <HeaderWithLogo />

      <Text
        height={TextHeights.EXTRA_LARGE}
        size={TextSizes.LARGE}
        weight={TextWeights.BOLD}
      >
        You should only register a new identity if it isn't already associated
        with an account. If you already have registered please recover your
        account.
      </Text>

      <Spacing size="var(--s-26)" />

      <CTA>
        <Button onClick={onCtaClicked}>Create</Button>
      </CTA>

      <Spacing size="var(--s-12)" />

      <Subsubtitle>
        If you need help on anything related to Fractal ID Wallet, please
        contact us at{" "}
        <Link href="mailto:support@fractal.id">support@fractal.id</Link>
      </Subsubtitle>
    </Container>
  );
}
