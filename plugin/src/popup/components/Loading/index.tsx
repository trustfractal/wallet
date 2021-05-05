import styled from "styled-components";

import Logo from "@popup/components/common/Logo";
import Spinner from "@popup/components/common/Spinner";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";

const RootContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 460px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: var(--s-16);
`;

const SpinnerContainer = styled.div`
  margin-right: var(--s-8);
`;

function Loading() {
  return (
    <RootContainer>
      <Logo />
      <TextContainer>
        <SpinnerContainer>
          <Spinner alternative />
        </SpinnerContainer>
        <Text
          size={TextSizes.LARGE}
          height={TextHeights.LARGE}
          weight={TextWeights.BOLD}
        >
          Loading...
        </Text>
      </TextContainer>
    </RootContainer>
  );
}

export default Loading;
