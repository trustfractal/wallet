import { useCallback, useEffect, useState } from "react";
import { Observable } from "rxjs";

// Note that this memoizes the loader promise since the common case is
// explicitly not wanting it to change between calls. This makes the API simpler
// while being slightly potentially surprising if the callback is expected to be
// evaluated multiple times (which we don't expect to be common).
export function useLoadedState<T>(loader: () => Promise<T>): Load<T> {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState<T>();

  // The common case is to only want to call the loader once, so we memoize it
  // for the user to prevent all users from having to do that themselves.
  // eslint-disable-next-line
  const memoLoader = useCallback(() => loader(), []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (loaded) return;
      if (!active) return;

      const v = await memoLoader();
      // Value may have been set by `setValue` on result before loader finishes.
      if (loaded) return;
      if (!active) return;

      setValue(v);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [memoLoader, loaded]);

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
  unwrapOrDefault<U>(def: U): T | U;
}

class NotEmitted<T> implements Observed<T> {
  hasValue = false;

  unwrapOrDefault<U>(def: U) {
    return def;
  }
}

class Value<T> {
  hasValue = true;

  constructor(public readonly value: T) {}

  unwrapOrDefault<U>(_: U) {
    return this.value;
  }
}
