export default class HttpService {
  public static async call(
    route: string,
    method: RequestInit["method"] = "GET",
    body?: RequestInit["body"],
    headers?: RequestInit["headers"],
    timeout = 8000,
  ): Promise<any> {
    const controller = new AbortController();
    const id = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(route, {
        method,
        body,
        headers,
        signal: controller.signal,
      });

      clearTimeout(id);

      return response;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("Request timeout");

      throw error;
    }
  }
}
