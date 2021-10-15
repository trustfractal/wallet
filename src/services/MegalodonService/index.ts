import Environment from "@environment/index";

import { CatfishService } from "@services/CatfishService";
import HttpService from "@services/HttpService";
import { FractalAccountConnector } from "@services/FractalAccount";

const HTTP_TIMEOUT = 5 * 60 * 1000; // 5 minutes timeout

export class MegalodonService {
  constructor(
    private readonly fractalAccount: FractalAccountConnector,
    private readonly catfish: CatfishService,
  ) {}

  private async ensureAuthorization(
    headers: Record<string, string>,
  ): Promise<Record<string, string>> {
    if (headers["authorization"]) return headers;

    const token = await this.fractalAccount.getMegalodonToken();

    headers["authorization"] = `Bearer ${token}`;
    headers["content-type"] = "application/json";

    return headers;
  }

  private async callAuthorizedApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    const headersWithAuth = await this.ensureAuthorization(
      (headers as Record<string, string>) || {},
    );
    return this.callApi(route, method, body, headersWithAuth);
  }

  private async callApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    const response = await HttpService.call(
      `${Environment.MEGALODON_URL}/${route}`,
      method,
      body,
      headers,
      HTTP_TIMEOUT,
    );

    if (!response.ok) {
      // check if megalodon token has expired
      if (response.status === 401) {
        return this.catfish.refreshResourceServerToken().then(async (token) => {
          const response = await HttpService.call(
            `${Environment.MEGALODON_URL}/${route}`,
            method,
            body,
            {
              ...headers,
              authorization: `Bearer ${token}`,
            },
          );

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          return response.json();
        });
      }

      throw new Error(response.statusText);
    }

    return response.json();
  }

  public me() {
    return this.callAuthorizedApi("users/me", "GET", null);
  }
}
