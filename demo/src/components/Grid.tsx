import Head from "next/head";
import styled from "styled-components";

const Root = styled.div`
  max-width: 1000px;
  padding: 1rem;
  margin: 0 auto;
`;

const Grid = ({ children }) => (
  <Root>
    <Head>
      <title>Demo Website</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    {children}
  </Root>
);

export default Grid;
