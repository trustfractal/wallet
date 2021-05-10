import { css, createGlobalStyle } from "styled-components";

import { global } from "@popup/styles/GlobalStyle";
import { reset } from "@popup/styles/ResetStyle";
import { normalize } from "@popup/styles/NormalizeStyle";

export const uploadGlobalStyle = css`
  ${reset}
  ${normalize}
  ${global}
  html {
    background-color: var(--c-white);
    color: var(--c-dark-blue);

    max-width: 100%;
    min-height: 100vh;

    font-size: 16px;
  }
`;

const Global = createGlobalStyle`${uploadGlobalStyle}`;

export default Global;
