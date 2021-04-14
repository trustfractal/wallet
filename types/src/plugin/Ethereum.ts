export interface IEthereumProviderProps {
  available?: boolean;
  loading?: boolean;
  ethereum?: IEthereum;
}

export interface IRequestArguments {
  method: string;
  params?: unknown[] | object;
}

export type EthereumAccount = string;

export type EthereumRequestResponse = EthereumAccount[];

export interface IEthereum {
  isMetaMask?: boolean;
  request?(args: IRequestArguments): Promise<EthereumRequestResponse>;
}
