import AppStore from "@redux/stores/application";
import { getBackendMegalodonSession } from "@redux/stores/application/reducers/auth/selectors";

import Environment from "@environment/index";

import CatfishService from "@services/CatfishService";

export default class MaguroService {
  private static async callApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    return fetch(`${Environment.MAGURO_URL}/${route}`, {
      method,
      body,
      headers,
    }).then((response: Response) => {
      if (!response.ok) {
        // check if megalodon token has expired
        if (headers && (headers as Record<string, string>)["authorization"]) {
          if (response.status === 401) {
            return CatfishService.refreshResourceServerToken().then((token) =>
              this.callApi(route, method, body, {
                ...headers,
                authorization: token,
              }),
            );
          }
        }

        throw new Error(response.statusText);
      } else {
        return response.json();
      }
    });
  }

  public static getCredentials() {
    const token = getBackendMegalodonSession(AppStore.getStore().getState());

    return this.callApi("credentials", "GET", null, {
      authorization: `Bearer ${token}`,
    });
  }
}
