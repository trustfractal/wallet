import { createContext, useState } from "react";

export const ActivityStackContext = createContext<Updater>({
  push: () => {},
  pop: () => {},
});

export interface Updater {
  push: (item: React.ReactNode) => void;
  pop: () => void;
}

export function ActivityStack({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<React.ReactNode[]>([]);

  const updater = {
    push: (item: React.ReactNode) => {
      setStack([...stack, item]);
    },
    pop: () => {
      setStack(stack.slice(0, stack.length - 1));
    },
  };

  const lastItem = stack[stack.length - 1];
  const content =
    lastItem == null ? children : <CloseActivity>{lastItem}</CloseActivity>;

  return (
    <ActivityStackContext.Provider value={updater}>
      {content}
    </ActivityStackContext.Provider>
  );
}

function CloseActivity({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
