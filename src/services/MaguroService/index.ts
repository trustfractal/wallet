import AppStore from "@redux/stores/application";
import { getBackendMegalodonSession } from "@redux/stores/application/reducers/auth/selectors";

import Environment from "@environment/index";

import CatfishService from "@services/CatfishService";
import HttpService from "@services/HttpService";

export default class MaguroService {
  private static async callApi(
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
    );

    if (!response.ok) {
      // check if megalodon token has expired
      if (headers && (headers as Record<string, string>)["authorization"]) {
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
      }

      throw new Error(response.statusText);
    }

    return response.json();
  }

  public static getCredentials() {
    const token = getBackendMegalodonSession(AppStore.getStore().getState());

    return this.callApi("credentials", "GET", null, {
      authorization: `Bearer ${token}`,
    });
  }
}
