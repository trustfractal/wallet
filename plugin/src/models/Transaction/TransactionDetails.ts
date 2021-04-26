import { BigNumber } from "ethers";

import { ITransactionDetails, ISerializable } from "@fractalwallet/types";

export default class TransactionDetails
  implements ITransactionDetails, ISerializable {
  public chainId: number;
  public data: string;
  public from: string;
  public gasLimit: BigNumber;
  public gasPrice: BigNumber;
  public value: BigNumber;
  public estimatedTime?: BigNumber;

  public constructor(
    chainId: number,
    data: string,
    from: string,
    gasLimit: BigNumber,
    gasPrice: BigNumber,
    value: BigNumber,
    estimatedTime?: BigNumber,
  ) {
    this.chainId = chainId;
    this.data = data;
    this.from = from;
    this.gasLimit = gasLimit;
    this.gasPrice = gasPrice;
    this.value = value;
    this.estimatedTime = estimatedTime;
  }

  public serialize(): string {
    return JSON.stringify({
      chainId: this.chainId,
      data: this.data,
      from: this.from,
      gasLimit: this.gasLimit.toJSON(),
      gasPrice: this.gasPrice.toJSON(),
      value: this.value.toJSON(),
      estimatedTime: this.estimatedTime?.toJSON(),
    });
  }

  public static parse(str: string): TransactionDetails {
    const {
      chainId,
      data,
      from,
      gasLimit,
      gasPrice,
      value,
      estimatedTime,
    } = JSON.parse(str);

    return new TransactionDetails(
      chainId,
      data,
      from,
      BigNumber.from(gasLimit),
      BigNumber.from(gasPrice),
      BigNumber.from(value),
      estimatedTime ? BigNumber.from(estimatedTime) : undefined,
    );
  }
}
