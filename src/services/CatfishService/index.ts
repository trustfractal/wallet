import AppStore from "@redux/stores/application";
import {
  getBackendCatfishSession,
  getBackendScopes,
} from "@redux/stores/application/reducers/auth/selectors";
import authActions from "@redux/stores/application/reducers/auth";

import Environment from "@environment/index";

export default class CatfishService {
  private static async callApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    return fetch(`${Environment.CATFISH_URL}/${route}`, {
      method,
      body,
      headers,
    }).then((response: Response) => {
      if (!response.ok) throw new Error(response.statusText);
      else return response.json();
    });
  }

  public static refreshResourceServerToken() {
    const token = getBackendCatfishSession(AppStore.getStore().getState());

    return this.callApi("account/me", "GET", null, {
      authorization: `Bearer ${token}`,
    }).then(({ data }) =>
      CatfishService.resourceServerAccessToken({ username: data.user_id }).then(
        ({ data }) => {
          // update token
          AppStore.getStore().dispatch(
            authActions.setBackendMegalodonSession(data.access_token),
          );
          return data.access_token;
        },
      ),
    );
  }

  public static resourceServerAccessToken({ username }: { username: string }) {
    const token = getBackendCatfishSession(AppStore.getStore().getState());
    const scopes = getBackendScopes(AppStore.getStore().getState());

    return this.callApi(
      "/oauth/token",
      "POST",
      JSON.stringify({
        grant_type: "password",
        password: token,
        scope: scopes,
        username,
      }),
    );
  }
}
