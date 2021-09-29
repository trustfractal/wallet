import ContentScriptConnection from "@background/connection";
import environment from "@environment/index";
import { ERROR_NOT_ON_FRACTAL } from "@models/Connection/Errors";
import { IMiddleware } from "@pluginTypes/index";
import { getWindowsService } from "@services/Factory";

export default class FractalWebpageMiddleware implements IMiddleware {
  public async apply(): Promise<void> {
    // get active connected chrome port
    const fractalTab = await ContentScriptConnection.getConnectedPort();

    if (!fractalTab) {
      getWindowsService().openTab(environment.FRACTAL_WEBSITE_URL);

      throw ERROR_NOT_ON_FRACTAL();
    }
  }
}
