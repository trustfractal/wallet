import { BigNumber } from "ethers";

import { ISerializable } from "./Common";

export interface ITransactionDetails extends ISerializable {
  chainId: number;
  data: string;
  from: string;
  gasLimit: BigNumber;
  gasPrice: BigNumber;
  value: BigNumber;
  estimatedTime?: BigNumber;
}
