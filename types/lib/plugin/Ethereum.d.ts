export interface IEthereumProviderProps {
    available?: boolean;
    loading?: boolean;
    ethereum?: IEthereum;
}
export interface IRequestArguments {
    method: string;
    params?: unknown[] | object;
}
export declare type EthereumAccount = string;
export declare type EthereumRequestResponse = EthereumAccount[];
export interface IEthereum {
    isMetaMask?: boolean;
    request?(args: IRequestArguments): Promise<EthereumRequestResponse>;
}
