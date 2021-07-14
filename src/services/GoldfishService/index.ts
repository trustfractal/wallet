import Environment from "@environment/index";

export default class GoldfishService {
  private static async callApi(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
  ): Promise<any> {
    return fetch(`${Environment.GOLDFISH_URL}/${route}`, {
      method,
      body,
      headers,
    }).then((response: Response) => {
      if (!response.ok) throw new Error(response.statusText);
      else return response.json();
    });
  }

  public static getAddresses() {
    return this.callApi("addresses");
  }
}
