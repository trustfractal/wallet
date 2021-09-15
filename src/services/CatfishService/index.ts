import AppStore from "@redux/stores/application";
import {
  getBackendCatfishSession,
  getBackendScopes,
} from "@redux/stores/application/reducers/auth/selectors";
import authActions from "@redux/stores/application/reducers/auth";
import appActions from "@redux/stores/application/reducers/app";

import Environment from "@environment/index";
import HttpService from "@services/HttpService";
import { ERRORS_CATFISH_TOKEN_EXPIRED } from "./Errors";

export default class CatfishService {
  private static async callApi(
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

    if (!response.ok) {
      // check if catfish token has expired
      if (response.status === 401) {
        // ask user to connect with fractal wallet again
        AppStore.getStore().dispatch(appActions.setSetup(false));
        throw ERRORS_CATFISH_TOKEN_EXPIRED();
      }
    }

    return response.json();
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
