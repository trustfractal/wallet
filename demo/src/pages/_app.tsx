import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --c-black: #222;
    --c-dark-gray: #444;
    --c-white: #eaeaea;
    --s-1: 0.296rem;
    --s-2: 0.444rem;
    --s-3: 0.667rem;
    --s-4: 1rem;
    --s-5: 1.5rem;
    --s-6: 2.25rem;
    --s-7: 3.375rem;
    --s-8: 5.063rem;
    --s-9: 7.594rem;
  }

  html {
    background-color: var(--c-white);
    font-size: var(--s-4);
    line-height: var(--s-5);
    color: var(--c-black);
  }

  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`;

const App = ({ Component, pageProps }) => (
  <>
    <GlobalStyle />
    <Component {...pageProps} />
  </>
);

export default App;
