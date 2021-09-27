import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useUserSelector } from "@redux/stores/user/context";
import { getWallet } from "@redux/stores/user/reducers/protocol/selectors";

import { ProtocolService } from ".";
import { getProtocolService } from "@services/Factory";

interface Props {
  children: ReactNode;
}

export const ProtocolContext = createContext<ProtocolService | null>(null);

export const ProtocolProvider = ({ children }: Props) => {
  const [protocol, setProtocol] = useState<ProtocolService | null>(null);
  const [isReady, setIsReady] = useState(false);
  const wallet = useUserSelector(getWallet);

  useEffect(() => {
    if (!isReady && wallet) {
      const setupService = async () => {
        const service = await getProtocolService(wallet.mnemonic);
        setProtocol(service);
        setIsReady(true);
      };

      setupService();
    }
  }, [isReady, wallet]);

  return (
    <ProtocolContext.Provider value={protocol}>
      {children}
    </ProtocolContext.Provider>
  );
};

export const useProtocol = () => useContext(ProtocolContext);
