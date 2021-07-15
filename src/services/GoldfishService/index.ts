import Environment from "@environment/index";
import HttpService from "@services/HttpService";

export default class GoldfishService {
  private static async callApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    const response = await HttpService.call(
      `${Environment.GOLDFISH_URL}/${route}`,
      method,
      body,
      headers,
    );

    if (!response.ok) throw new Error(response.statusText);

    return response.json();
  }

  public static getAddresses() {
    return this.callApi("addresses");
  }
}
