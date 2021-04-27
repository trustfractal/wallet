export type Environment = {
  FRACTAL_WEBSITE_HOSTNAME: string;
  CONTRACTS: {
    ERC_20_CONTRACTS: {
      FCL: string;
      FCL_ETH_LP: string;
    };
    CLAIMS_REGISTRY_CONTRACT: string;
    STAKING_CONTRACTS: {
      FCL: string;
      FCL_ETH_LP: string;
    };
  };
};
