import styled from "styled-components";

import TopComponent from "@popup/components/common/TopComponent";

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function Credentials() {
  return (
    <TopComponent>
      <Container>
        <h1>You need to opt-in to the Protocol first</h1>
      </Container>
    </TopComponent>
  );
}

Credentials.defaultProps = {
  credentials: [],
};

export default Credentials;
