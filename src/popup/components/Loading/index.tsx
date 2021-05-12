import styled from "styled-components";

import TopComponent from "@popup/components/common/TopComponent";
import Spinner from "../common/Spinner";
import Text, { TextHeights, TextSizes } from "../common/Text";
import Logo from "../common/Logo";

const RootContainer = styled.div`
  min-width: 400px;
  min-height: 460px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  margin-top: var(--s-168);
`;

const SpinnerContainer = styled.div`
  margin-right: var(--s-12);
`;

function Loading() {
  return (
    <TopComponent>
      <RootContainer>
        <Logo />
        <LabelContainer>
          <SpinnerContainer>
            <Spinner alternative />
          </SpinnerContainer>
          <Text size={TextSizes.LARGE} height={TextHeights.LARGE}>
            Loading...
          </Text>
        </LabelContainer>
      </RootContainer>
    </TopComponent>
  );
}

export default Loading;
