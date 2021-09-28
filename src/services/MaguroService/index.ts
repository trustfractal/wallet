import Environment from "@environment/index";
import appStore from "@redux/stores/application";
import { getBackendMegalodonSession } from "@redux/stores/application/reducers/auth/selectors";
import CatfishService from "@services/CatfishService";
import HttpService from "@services/HttpService";
import { MissingLiveness } from "@services/ProtocolOptIn";

const HTTP_TIMEOUT = 5 * 60 * 1000; // 5 minutes timeout

export class MaguroService {
  private async ensureAuthorization(
    headers: Record<string, string>,
  ): Promise<Record<string, string>> {
    if (headers["authorization"]) return headers;

    if (appStore.getStore() == null) {
      await appStore.init();
    }
    const token = getBackendMegalodonSession(appStore.getStore().getState());

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
    return await this.callApi(route, method, body, headersWithAuth);
  }

  private async callApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    const response = await HttpService.call(
      `${Environment.MAGURO_URL}/${route}`,
      method,
      body,
      headers,
      HTTP_TIMEOUT,
    );

    if (!response.ok) {
      // check if megalodon token has expired
      if (response.status === 401) {
        const token = await CatfishService.refreshResourceServerToken();
        const response = await HttpService.call(
          `${Environment.MAGURO_URL}/${route}`,
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
      }

      throw await response.json();
    }

    return await response.json();
  }

  public getCredentials() {
    return this.callAuthorizedApi("credentials", "GET", null);
  }

  public async registerIdentity(address: string) {
    try {
      return await this.callAuthorizedApi(
        "protocol/register_identity",
        "POST",
        JSON.stringify({ linked_address: address }),
      );
    } catch (e) {
      if (e.error === "missing_liveness") {
        throw new MissingLiveness();
      } else {
        throw e;
      }
    }
  }

  public async getConfig() {
    return await this.callApi("config", "GET", null);
  }

  public async currentNetwork(): Promise<string> {
    return (await this.getConfig()).network;
  }
}
