import { useState, useEffect } from "react";

export function useLoadedState<T>(loader: () => Promise<T>): Loading<T> {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState<T>();

  useEffect(() => {
    (async () => {
      const v = await loader();
      setLoaded(true);
      setValue(v);
    })();
  }, [loader]);

  if (loaded) {
    return new Loaded<T>(value!);
  } else {
    return new IsLoading<T>();
  }
}

interface Loading<T> {
  isLoading: boolean;
  value: T | null;

  unwrapOrDefault<U>(def: U): T | U;
}

class IsLoading<T> implements Loading<T> {
  isLoading = true;
  value = null;

  unwrapOrDefault<U>(def: U): U {
    return def;
  }
}

class Loaded<T> implements Loading<T> {
  isLoading = false;

  constructor(public readonly value: T) {}

  unwrapOrDefault<U>(_def: U): T {
    return this.value;
  }
}
