import Environment from "@environment/index";

export default class MaguroService {
  private static async callApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    return await (
      await fetch(`${Environment.MAGURO_URL}/${route}`, {
        method,
        body,
        headers,
      })
    ).json();
  }

  public static getCredentials(token: string) {
    return this.callApi("credentials", "GET", null, {
      "megalodon-token": token,
    });
  }
}
