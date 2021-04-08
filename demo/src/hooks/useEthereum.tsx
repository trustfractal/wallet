import React, { useContext, useState, useEffect, createContext } from "react";

import { useGlobalError } from "./useGlobalError";

export const EthereumContext = createContext(null);

const missingWalletError = {
  title: "Missing Ethereum Wallet",
  message:
    "You are missing an Ethereum Wallet extension (e.g. Metamask). Please install one first.",
};

export const EthereumProvider = ({ children }) => {
  const [ethereum, setEthereum] = useState();
  const [loading, setLoading] = useState(true);
  const { addError } = useGlobalError();

  useEffect(() => {
    window.ethereum
      ? setEthereum(window.ethereum)
      : addError(missingWalletError);

    setLoading(false);
  }, []);

  return (
    <EthereumContext.Provider
      value={{
        available: !loading && ethereum,
        ethereum,
        loading,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};

export const useEthereum = () => useContext(EthereumContext);
