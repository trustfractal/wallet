import Head from "next/head";
import styled from "styled-components";

import { useGlobalError } from "../hooks/useGlobalError";

const Root = styled.div`
  max-width: 1000px;
  padding: 1rem;
  margin: 0 auto;
`;

const renderError = ({ title, message }, idx: number) => (
  <div key={idx}>
    <p>
      <strong>{title}</strong>
    </p>
    <p>{message}</p>
  </div>
);

const Grid = ({ children }) => {
  const { errors } = useGlobalError();

  return (
    <Root>
      <Head>
        <title>Demo Website</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {errors.length === 0 ? children : errors.map(renderError)}
    </Root>
  );
};

export default Grid;
