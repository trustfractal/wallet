import Environment from "@environment/index";
import HttpService from "@services/HttpService";
import { ERRORS_CATFISH_TOKEN_EXPIRED } from "./Errors";
import { FractalAccountConnector } from "@services/FractalAccount";

const RESOURCE_SERVER_TOKEN_SCOPES = [
  "user.permanent_id:read",
  "user.verification:read",
].join(" ");

export class CatfishService {
  constructor(private readonly fractalAccount: FractalAccountConnector) {}

  private async callApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    const response = await HttpService.call(
      `${Environment.CATFISH_URL}/${route}`,
      method,
      body,
      headers,
    );

    if (response.status === 401) {
      // ask user to connect with fractal wallet again
      await this.fractalAccount.clearTokens();
      throw ERRORS_CATFISH_TOKEN_EXPIRED();
    }

    return response.json();
  }

  public async refreshResourceServerToken() {
    const token = await this.fractalAccount.getCatfishToken();

    const { user_id } = await this.callApi("account/me", "GET", null, {
      authorization: `Bearer ${token}`,
    });

    const { access_token } = await this.resourceServerAccessToken({
      username: user_id,
    });

    this.fractalAccount.setMegalodonToken(access_token);
    return access_token;
  }

  public async resourceServerAccessToken({ username }: { username: string }) {
    const token = await this.fractalAccount.getCatfishToken();

    return await this.callApi(
      "oauth/token",
      "POST",
      JSON.stringify({
        grant_type: "password",
        password: token,
        scope: RESOURCE_SERVER_TOKEN_SCOPES,
        username,
      }),
      { "Content-Type": "application/json" },
    );
  }
}
