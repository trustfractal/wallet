import { IMiddleware, IInvokation } from "@fractalwallet/types";
import ContentScriptConnection from "@background/connection";
import { FRACTAL_WEBSITE_HOSTNAME } from "@constants/common";

export function ensureIsOnFractalWebpage(port: chrome.runtime.Port) {
  if (!port.sender || !port.sender.url) {
    throw new Error("Couldn't get sender");
  }

  const { hostname, protocol } = new URL(port.sender.url);

  const senderHostname = hostname.startsWith("www.")
    ? hostname.substr(4)
    : hostname;

  if (senderHostname !== FRACTAL_WEBSITE_HOSTNAME) {
    throw new Error("Active tab is not on the fractal website domain.");
  }

  // check ssl
  if (protocol !== "https:") {
    throw new Error("Not on a ssl connection.");
  }
}

export default class FractalWebpageMiddleware implements IMiddleware {
  public async apply(_invokation: IInvokation): Promise<void> {
    // get active connected chrome port
    const activePort = await ContentScriptConnection.getActiveConnectionPort();

    if (!activePort) {
      throw new Error("No active tabs could be found");
    }

    // ensure that the active port is on the fractal domain
    ensureIsOnFractalWebpage(activePort.port);
  }
}
