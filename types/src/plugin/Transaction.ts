import { BigNumber } from "ethers";

import { ISerializable } from "./Common";

export interface ITransactionDetails extends ISerializable {
  hash: string;
  chainId: number;
  data: string;
  from: string;
  gasLimit: BigNumber;
  gasPrice: BigNumber;
  value: BigNumber;
  estimatedTime?: BigNumber;
}
