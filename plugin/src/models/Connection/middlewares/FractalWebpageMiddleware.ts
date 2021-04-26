import { IMiddleware, IInvokation } from "@fractalwallet/types";
import ContentScriptConnection from "@background/connection";
import { FRACTAL_WEBSITE_HOSTNAME } from "@constants/common";
import WindowsService from "@services/WindowsService";

function isOnFractalWebpage(port: chrome.runtime.Port): boolean {
  if (!port.sender || !port.sender.url) {
    throw new Error("Couldn't get sender");
  }

  const { hostname, protocol } = new URL(port.sender.url);

  const senderHostname = hostname.startsWith("www.")
    ? hostname.substr(4)
    : hostname;

  if (senderHostname !== FRACTAL_WEBSITE_HOSTNAME) {
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
      throw new Error("No active tabs could be found");
    }

    // checj if the active port is on the fractal domain
    const onFractal = isOnFractalWebpage(activePort.port);

    if (!onFractal) {
      if (activePort.port?.sender?.tab?.id) {
        WindowsService.redirectTab(
          activePort.port?.sender?.tab?.id,
          `https://${FRACTAL_WEBSITE_HOSTNAME}`,
        );
      }

      throw new Error("Active tab is not on the fractal website domain.");
    }
  }
}
