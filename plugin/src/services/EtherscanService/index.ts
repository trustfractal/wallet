import { BigNumber } from "ethers";
import { EtherscanApiResponse } from "@fractalwallet/types";

import EtherscanApiStatus from "./status";

export default class EtherscanService {
  public static API_BASE_URL: string = "https://api.etherscan.io/api";
  public static API_KEY: string = "";
  public static API_RATE_LIMIT_TIME: number = 5 * 1000; // 5 seconds

  private static async callApi(
    params: URLSearchParams,
    recursive: boolean = false,
  ): Promise<EtherscanApiResponse> {
    const response = await (
      await fetch(`${EtherscanService.API_BASE_URL}?${params.toString()}`)
    ).json();

    const { status } = response;

    if (status === EtherscanApiStatus.FAILED && !recursive) {
      // sleep
      await new Promise<void>((resolve) =>
        setTimeout(() => resolve(), EtherscanService.API_RATE_LIMIT_TIME),
      );

      // retry one more time
      return this.callApi(params, true);
    }

    return response;
  }

  public static async getEstimationOfConfirmationTime(
    gasPrice: BigNumber,
  ): Promise<BigNumber | undefined> {
    const params = {
      module: "gastracker",
      action: "gasestimate",
      gasPrice: gasPrice.toString(),
    };

    const urlParams = new URLSearchParams(params);

    if (EtherscanService.API_KEY.length > 0) {
      urlParams.append("apikey", EtherscanService.API_KEY);
    }

    try {
      const { status, result } = await this.callApi(urlParams);

      if (status === EtherscanApiStatus.FAILED) {
        return;
      }

      if (status === EtherscanApiStatus.SUCCESS) {
        return BigNumber.from(result);
      }
    } catch (error) {
      return;
    }
  }
}
