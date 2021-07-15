import AppStore from "@redux/stores/application";
import {
  getBackendCatfishSession,
  getBackendScopes,
} from "@redux/stores/application/reducers/auth/selectors";
import authActions from "@redux/stores/application/reducers/auth";

import Environment from "@environment/index";
import HttpService from "@services/HttpService";

export default class CatfishService {
  private static async callApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    return HttpService.call(
      `${Environment.CATFISH_URL}/${route}`,
      method,
      body,
      headers,
    ).then((response: Response) => {
      if (!response.ok) throw new Error(response.statusText);
      else return response.json();
    });
  }

  public static async refreshResourceServerToken() {
    const token = getBackendCatfishSession(AppStore.getStore().getState());

    const { user_id } = await this.callApi("account/me", "GET", null, {
      authorization: `Bearer ${token}`,
    });

    const { access_token } = await CatfishService.resourceServerAccessToken({
      username: user_id,
    });

    // update token
    AppStore.getStore().dispatch(
      authActions.setBackendMegalodonSession(access_token),
    );
    return access_token;
  }

  public static resourceServerAccessToken({ username }: { username: string }) {
    const token = getBackendCatfishSession(AppStore.getStore().getState());
    const scopes = getBackendScopes(AppStore.getStore().getState());

    return this.callApi(
      "oauth/token",
      "POST",
      JSON.stringify({
        grant_type: "password",
        password: token,
        scope: scopes,
        username,
      }),
      { "Content-Type": "application/json" },
    );
  }
}
