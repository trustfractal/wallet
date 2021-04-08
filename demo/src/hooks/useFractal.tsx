import React, { useContext, useState, useEffect, createContext } from "react";

import { useGlobalError } from "./useGlobalError";

export const FractalContext = createContext(null);

const missingWalletError = {
  title: "Missing Fractal Wallet",
  message:
    "You are missing the Fractal Wallet extension. Please install it first.",
};

export const FractalProvider = ({ children }) => {
  const [fractal, setFractal] = useState();
  const [loading, setLoading] = useState(true);
  const { addError } = useGlobalError();

  useEffect(() => {
    /* window.fractal ? setFractal(window.fractal) : addError(missingWalletError); */

    setLoading(false);
  }, []);

  return (
    <FractalContext.Provider
      value={{
        available: !loading && fractal,
        fractal,
        loading,
      }}
    >
      {children}
    </FractalContext.Provider>
  );
};

export const useFractal = () => useContext(FractalContext);
