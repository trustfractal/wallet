import { IWindowParameters } from "@fractalwallet/types";

export const POPUP: chrome.windows.CreateData = {
  focused: true,
  height: 600,
  width: 400,
  left: 0,
  top: 0,
  type: "popup",
};

export const PARAMS: IWindowParameters = {
  POPUP,
};

export default PARAMS;
