import { css, createGlobalStyle } from "styled-components";

import { reset } from "./ResetStyle";
import { normalize } from "./NormalizeStyle";

export const global = css`
  ${reset}
  ${normalize}
  :root {
    --c-white: #ffffff;
    --c-dark-blue: #132c53;
    --c-red: rgba(239, 68, 68);
    --c-transparent: transparent;
    --c-orange: #ff671d;
    --s-5: 0.3125rem;
    --s-8: 0.5rem;
    --s-10: 0.625rem;
    --s-12: 0.75rem;
    --s-14: 0.875rem;
    --s-16: 1rem;
    --s-168: 1.05rem;
    --s-1875: 1.171875rem;
    --s-19: 1.1875rem;
    --s-20: 1.25rem;
    --s-23: 1.4375rem;
    --s-24: 1.5rem;
    --s-26: 1.625rem;
    --s-32: 2rem;
    --s-35: 2.1875rem;
    --s-35: 2.375rem;
    --s-48: 3rem;
  }

  html {
    background-color: var(--c-dark-blue);
    color: var(--c-white);

    min-width: 400px;
    min-height: 460px;

    font-size: 14px; // TODO: Remove this
  }

  html,
  body {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
`;

const Global = createGlobalStyle`${global}`;

export default Global;
