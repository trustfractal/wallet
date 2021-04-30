import { IMiddleware, IInvokation } from "@fractalwallet/types";
import ContentScriptConnection from "@background/connection";
import WindowsService from "@services/WindowsService";

import {
  ERROR_NO_SENDER,
  ERROR_NO_ACTIVE_TAB,
  ERROR_NOT_ON_FRACTAL,
} from "@models/Connection/Errors";

import env from "@environment/index";
import environment from "@environment/index";

function isOnFractalWebpage(port: chrome.runtime.Port): boolean {
  if (!port.sender || !port.sender.url) {
    throw ERROR_NO_SENDER();
  }

  const { hostname, protocol } = new URL(port.sender.url);

  const senderHostname = hostname.startsWith("www.")
    ? hostname.substr(4)
    : hostname;

  if (senderHostname !== env.FRACTAL_WEBSITE_HOSTNAME) {
    return false;
  }

  // check ssl
  if (protocol !== "https:") {
    return false;
  }

  return true;
}

export default class FractalWebpageMiddleware implements IMiddleware {
  public async apply(_invokation: IInvokation): Promise<void> {
    // get active connected chrome port
    const activePort = await ContentScriptConnection.getActiveConnectionPort();

    if (!activePort) {
      if (environment.IS_DEV) {
        WindowsService.openTab(`http://${env.FRACTAL_WEBSITE_HOSTNAME}`);
      } else {
        WindowsService.openTab(`https://${env.FRACTAL_WEBSITE_HOSTNAME}`);
      }

      throw ERROR_NO_ACTIVE_TAB();
    }

    // check if the active port is on the fractal domain
    const onFractal = isOnFractalWebpage(activePort.port);

    if (!onFractal) {
      if (environment.IS_DEV) {
        console.warn(ERROR_NOT_ON_FRACTAL().message);
        return;
      }

      if (activePort.port?.sender?.tab?.id) {
        WindowsService.redirectTab(
          activePort.port?.sender?.tab?.id,
          `https://${env.FRACTAL_WEBSITE_HOSTNAME}`,
        );
      }

      throw ERROR_NOT_ON_FRACTAL();
    }
  }
}
