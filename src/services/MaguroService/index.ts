import AppStore from "@redux/stores/application";
import { getBackendMegalodonSession } from "@redux/stores/application/reducers/auth/selectors";

import Environment from "@environment/index";

import CatfishService from "@services/CatfishService";
import HttpService from "@services/HttpService";

export default class MaguroService {
  private static ensureAuthorization(
    headers: Record<string, string>,
  ): Record<string, string> {
    if (headers["authorization"]) return headers;

    const token = getBackendMegalodonSession(AppStore.getStore().getState());

    headers["authorization"] = `Bearer ${token}`;
    headers["content-type"] = "application/json";

    return headers;
  }

  private static async callApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    const headersWithAuth = this.ensureAuthorization(
      (headers as Record<string, string>) || {},
    );

    const response = await HttpService.call(
      `${Environment.MAGURO_URL}/${route}`,
      method,
      body,
      headersWithAuth,
    );

    if (!response.ok) {
      // check if megalodon token has expired
      if (response.status === 401) {
        return CatfishService.refreshResourceServerToken().then(
          async (token) => {
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
          },
        );
      }

      throw new Error(response.statusText);
    }

    return response.json();
  }

  public static getCredentials() {
    return this.callApi("credentials", "GET", null);
  }

  public static registerIdentity(address: string) {
    return this.callApi(
      "protocol/register_identity",
      "POST",
      JSON.stringify({ linked_address: address }),
    );
  }
}
