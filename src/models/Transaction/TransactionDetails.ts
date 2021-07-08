import { BigNumber } from "ethers";

import { ITransactionDetails, ISerializable } from "@pluginTypes/index";

export default class TransactionDetails
  implements ITransactionDetails, ISerializable
{
  public hash: string;
  public chainId: number;
  public data: string;
  public from: string;
  public gasLimit: BigNumber;
  public gasPrice: BigNumber;
  public value: BigNumber;
  public estimatedTime?: BigNumber;

  public constructor(
    hash: string,
    chainId: number,
    data: string,
    from: string,
    gasLimit: BigNumber,
    gasPrice: BigNumber,
    value: BigNumber,
    estimatedTime?: BigNumber,
  ) {
    this.hash = hash;
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
      hash: this.hash,
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
      hash,
      chainId,
      data,
      from,
      gasLimit,
      gasPrice,
      value,
      estimatedTime,
    } = JSON.parse(str);

    return new TransactionDetails(
      hash,
      chainId,
      data,
      from,
      gasLimit ? BigNumber.from(gasLimit) : BigNumber.from(0),
      gasPrice ? BigNumber.from(gasPrice) : BigNumber.from(0),
      value ? BigNumber.from(value) : BigNumber.from(0),
      estimatedTime ? BigNumber.from(estimatedTime) : undefined,
    );
  }
}
