import { Request, Response } from "express";

import Controller from "./Controller";
import Wallet from "../../wallet";
import { getEnv } from "../../utils";

const FCL_CONTRACT = getEnv("FCL_CONTRACT");
const FCL_UNISWAP_CONTRACT = getEnv("FCL_UNISWAP_CONTRACT");
const STAKING_FCL_CONTRACT = getEnv("STAKING_FCL_CONTRACT");
const STAKING_FCL_UNISWAP_CONTRACT = getEnv("STAKING_FCL_UNISWAP_CONTRACT");
const DID_CONTRACT = getEnv("DID_CONTRACT");
const ETHEREUM_NETWORK = getEnv("ETHEREUM_NETWORK");

export default class AddressController extends Controller {
  public req: Request;
  public res: Response;

  constructor(req: Request, res: Response) {
    super(req, res);
    this.req = req;
    this.res = res;
  }

  public async show() {
    const addresses = {
      fclContract: FCL_CONTRACT,
      fclUniswapContract: FCL_UNISWAP_CONTRACT,
      stackingFclContract: STAKING_FCL_CONTRACT,
      stackingFclUniswapContract: STAKING_FCL_UNISWAP_CONTRACT,
      didContract: DID_CONTRACT,
      ethereumNetwork: ETHEREUM_NETWORK,
      issuerAddress: Wallet.address,
    };

    this.res.status(200).send(addresses);
  }
}
