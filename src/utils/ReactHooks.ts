import { useState, useEffect } from "react";
import { Observable } from "rxjs";

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

export function useObservedState<T>(
  observable: () => Observable<T>,
): Observed<T> {
  const [hasValue, setHasValue] = useState(false);
  const [value, setValue] = useState<T>();

  useEffect(() => {
    const sub = observable().subscribe((v) => {
      setValue(v);
      setHasValue(true);
    });
    return () => sub.unsubscribe();
  }, [observable]);

  if (hasValue) {
    return new Value(value!);
  } else {
    return new NotEmitted<T>();
  }
}

export interface Observed<T> {
  hasValue: boolean;
  value?: T;
}

class NotEmitted<T> implements Observed<T> {
  hasValue = false;
}

class Value<T> {
  hasValue = true;

  constructor(public readonly value: T) {}
}
