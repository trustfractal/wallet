import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";

import { useUserSelector } from "@redux/stores/user/context";
import { getSigningKey } from "@redux/stores/user/reducers/protocol/selectors";

import ProtocolService from ".";

interface Props {
  children: ReactElement;
}

export const ProtocolContext = createContext<ProtocolService | null>(null);

export const ProtocolProvider = ({ children }: Props) => {
  const [protocol, setProtocol] = useState<ProtocolService | null>(null);
  const [isReady, setIsReady] = useState(false);
  const signingKey = useUserSelector(getSigningKey);

  console.log("signingKey", signingKey);

  useEffect(() => {
    if (!isReady && signingKey) {
      const setupService = async () => {
        const service = await ProtocolService.create(signingKey);
        setProtocol(service);
        setIsReady(true);
      };

      setupService();
    }
  }, [isReady, signingKey]);

  return (
    <ProtocolContext.Provider value={protocol}>
      {children}
    </ProtocolContext.Provider>
  );
};

export const useProtocol = () => useContext(ProtocolContext);
