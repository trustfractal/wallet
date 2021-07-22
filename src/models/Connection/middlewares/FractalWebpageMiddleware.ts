import { IMiddleware } from "@pluginTypes/index";
import ContentScriptConnection from "@background/connection";
import WindowsService from "@services/WindowsService";

import { ERROR_NOT_ON_FRACTAL } from "@models/Connection/Errors";

import environment from "@environment/index";

export default class FractalWebpageMiddleware implements IMiddleware {
  public async apply(): Promise<void> {
    // get active connected chrome port
    const fractalTab = await ContentScriptConnection.getConnectedPort();

    if (!fractalTab) {
      WindowsService.openTab(environment.FRACTAL_WEBSITE_URL);

      throw ERROR_NOT_ON_FRACTAL();
    }
  }
}
