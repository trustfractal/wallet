import { useState, useEffect } from "react";
import { Observable } from "rxjs";

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
