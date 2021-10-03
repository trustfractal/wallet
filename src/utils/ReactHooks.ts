import { useState, useEffect } from "react";

export function useLoadedState<T>(loader: () => Promise<T>): Load<T> {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState<T>();

  useEffect(() => {
    (async () => {
      if (loaded) return;

      const v = await loader();
      // Value may have been set by `setValue` on result before loader finishes.
      if (loaded) return;

      setValue(v);
      setLoaded(true);
    })();
  }, [loader, loaded]);

  const setLoadAndValue = (value: T) => {
    setValue(value);
    setLoaded(true);
  };

  if (loaded) {
    return new Loaded<T>(value!, setLoadAndValue);
  } else {
    return new Loading<T>(setLoadAndValue);
  }
}

type Load<T> = Loading<T> | Loaded<T>;

class Loading<T> {
  isLoaded: false = false;

  constructor(public readonly setValue: (t: T) => void) {}

  unwrapOrDefault<U>(def: U): U {
    return def;
  }
}

class Loaded<T> {
  isLoaded: true = true;

  constructor(
    public readonly value: T,
    public readonly setValue: (t: T) => void,
  ) {}

  unwrapOrDefault<U>(_def: U): T {
    return this.value;
  }
}
