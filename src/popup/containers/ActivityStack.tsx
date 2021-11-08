import { createContext, useContext, useState } from "react";

export const ActivityStackContext = createContext<Updater>({
  push: () => {},
  pop: () => {},
  stack: [],
});

export interface Updater {
  push: (item: React.ReactNode) => void;
  pop: () => void;
  stack: React.ReactNode[];
}

export function ActivityStack({ children }: { children: React.ReactNode }) {
  const updater = useContext(ActivityStackContext);

  const lastItem = updater.stack[updater.stack.length - 1];
  const content =
    lastItem == null ? children : <CloseActivity>{lastItem}</CloseActivity>;

  return <>{content}</>;
}

export function ActivityStackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stack, setStack] = useState<React.ReactNode[]>([]);

  const updater = {
    push: (item: React.ReactNode) => {
      setStack([...stack, item]);
    },
    pop: () => {
      setStack(stack.slice(0, stack.length - 1));
    },
    stack,
  };

  return (
    <ActivityStackContext.Provider value={updater}>
      {children}
    </ActivityStackContext.Provider>
  );
}

function CloseActivity({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
