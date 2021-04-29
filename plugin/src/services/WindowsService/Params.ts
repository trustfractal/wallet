import { IWindowParameters } from "@fractalwallet/types";

export const POPUP: chrome.windows.CreateData = {
  focused: true,
  height: 460,
  width: 400,
  top: 0,
  left: 0,
  type: "popup",
};

export const PARAMS: IWindowParameters = {
  POPUP,
};

export default PARAMS;
