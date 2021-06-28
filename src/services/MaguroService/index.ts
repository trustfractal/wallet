import AppStore from "@redux/stores/application";
import {
  getBackendMegalodonSession,
  getBackendSessions,
} from "@redux/stores/application/reducers/auth/selectors";

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
        if (headers && (headers as Record<string, string>)["megalodon-token"]) {
          if (response.status === 401) {
            console.log("refresh");

            CatfishService.refreshResourceServerToken().then((token) => {
              return this.callApi(route, method, body, {
                ...headers,
                "megalodon-token": token,
              });
            });
          }
        } else throw new Error(response.statusText);
      } else {
        return response.json();
      }
    });
  }

  public static getCredentials() {
    const sessions = getBackendSessions(AppStore.getStore().getState());
    const token = getBackendMegalodonSession(AppStore.getStore().getState());

    console.log("sessions", sessions);
    console.log("maguro token", token);

    return this.callApi("credentials", "GET", null, {
      "megalodon-token": token,
    });
  }
}
