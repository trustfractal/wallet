import AppStore from "@redux/stores/application";
import { getBackendMegalodonSession } from "@redux/stores/application/reducers/auth/selectors";

import Environment from "@environment/index";

import CatfishService from "@services/CatfishService";
import HttpService from "@services/HttpService";

const HTTP_TIMEOUT = 5 * 60 * 1000; // 5 minutes timeout

export default class MegalodonService {
  private static ensureAuthorization(
    headers: Record<string, string>,
  ): Record<string, string> {
    if (headers["authorization"]) return headers;

    const token = getBackendMegalodonSession(AppStore.getStore().getState());

    headers["authorization"] = `Bearer ${token}`;
    headers["content-type"] = "application/json";

    return headers;
  }

  private static async callAuthorizedApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    const headersWithAuth = this.ensureAuthorization(
      (headers as Record<string, string>) || {},
    );
    return this.callApi(route, method, body, headersWithAuth);
  }

  private static async callApi(
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
        return CatfishService.refreshResourceServerToken().then(
          async (token) => {
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
          },
        );
      }

      throw new Error(response.statusText);
    }

    return response.json();
  }

  public static me() {
    return this.callAuthorizedApi("users/me", "GET", null);
  }
}
