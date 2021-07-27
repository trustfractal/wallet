import styled from "styled-components";

import TopComponent from "@popup/components/common/TopComponent";

function Credentials() {
  return (
    <TopComponent>
      <h1>You need to opt-in to the Protocol first</h1>
    </TopComponent>
  );
}

Credentials.defaultProps = {
  credentials: [],
};

export default Credentials;
