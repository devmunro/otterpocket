export type PocketState = Record<string, unknown>;
export type PocketKey<TState extends PocketState> = Extract<keyof TState, string>;
export type PocketUpdater<TValue> = TValue | ((currentValue: TValue) => TValue);
export type PocketStateUpdater<TState extends PocketState> =
  | Partial<TState>
  | ((currentState: Readonly<TState>) => Partial<TState>);
export type PocketSelector<TState extends PocketState, TSelected> = (
  state: Readonly<TState>
) => TSelected;
export type PocketEqualityFn<TValue> = (left: TValue, right: TValue) => boolean;

export interface PocketStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

export interface PocketPersistOptions<TState extends PocketState> {
  key: string;
  storage?: PocketStorage;
  partialize?: (state: Readonly<TState>) => Partial<TState>;
}

export interface PocketOptions<TState extends PocketState = PocketState> {
  debug?: boolean;
  persist?: PocketPersistOptions<TState>;
}

export type PocketListener<TState extends PocketState> = (
  state: Readonly<TState>,
  previousState: Readonly<TState>,
  changedKeys: PocketKey<TState>[]
) => void;

export interface SelectorSubscriptionOptions<TState extends PocketState, TSelected> {
  equalityFn?: PocketEqualityFn<TSelected>;
  selector: PocketSelector<TState, TSelected>;
}

export interface PocketStore<TState extends PocketState> {
  get<K extends PocketKey<TState>>(key: K): TState[K];
  getState(): Readonly<TState>;
  getSelected<TSelected>(selector: PocketSelector<TState, TSelected>): TSelected;
  set<K extends PocketKey<TState>>(key: K, nextValue: PocketUpdater<TState[K]>): TState[K];
  setState(nextState: PocketStateUpdater<TState>): Readonly<TState>;
  subscribe(listener: PocketListener<TState>, key?: PocketKey<TState>): () => void;
  subscribeToSelector<TSelected>(
    selector: PocketSelector<TState, TSelected>,
    listener: (
      selectedValue: TSelected,
      previousSelectedValue: TSelected,
      state: Readonly<TState>,
      previousState: Readonly<TState>,
      changedKeys: PocketKey<TState>[]
    ) => void,
    equalityFn?: PocketEqualityFn<TSelected>
  ): () => void;
  toggle<K extends PocketKey<TState>>(key: K): TState[K];
  inc<K extends PocketKey<TState>>(key: K): TState[K];
  dec<K extends PocketKey<TState>>(key: K): TState[K];
  push<K extends PocketKey<TState>>(key: K, item: unknown): TState[K];
  remove<K extends PocketKey<TState>>(
    key: K,
    indexOrPredicate: number | ((item: unknown, index: number) => boolean)
  ): TState[K];
  reset<K extends PocketKey<TState>>(key: K): TState[K];
  resetAll(): Readonly<TState>;
}

const defaultEqualityFn = <TValue>(left: TValue, right: TValue) => Object.is(left, right);

function cloneInitialState<TState extends PocketState>(initialState: TState): TState {
  return { ...initialState };
}

function getKeyListenerSet<TState extends PocketState>(
  keyListeners: Map<PocketKey<TState>, Set<PocketListener<TState>>>,
  key: PocketKey<TState>
) {
  if (!keyListeners.has(key)) {
    keyListeners.set(key, new Set());
  }

  return keyListeners.get(key)!;
}

function resolveNextValue<TValue>(currentValue: TValue, nextValue: PocketUpdater<TValue>): TValue {
  return typeof nextValue === "function"
    ? (nextValue as (currentValue: TValue) => TValue)(currentValue)
    : nextValue;
}

function resolveStorage(storage?: PocketStorage) {
  if (storage) {
    return storage;
  }

  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }

  return undefined;
}

function mergePersistedState<TState extends PocketState>(
  initialState: TState,
  persistOptions?: PocketPersistOptions<TState>
) {
  if (!persistOptions) {
    return cloneInitialState(initialState);
  }

  const storage = resolveStorage(persistOptions.storage);

  if (!storage) {
    return cloneInitialState(initialState);
  }

  try {
    const storedValue = storage.getItem(persistOptions.key);

    if (!storedValue) {
      return cloneInitialState(initialState);
    }

    const parsedValue = JSON.parse(storedValue);

    if (parsedValue === null || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
      return cloneInitialState(initialState);
    }

    return {
      ...initialState,
      ...parsedValue,
    };
  } catch {
    return cloneInitialState(initialState);
  }
}

function persistState<TState extends PocketState>(
  state: Readonly<TState>,
  persistOptions?: PocketPersistOptions<TState>
) {
  if (!persistOptions) {
    return;
  }

  const storage = resolveStorage(persistOptions.storage);

  if (!storage) {
    return;
  }

  const serializedState = persistOptions.partialize
    ? persistOptions.partialize(state)
    : state;

  try {
    storage.setItem(persistOptions.key, JSON.stringify(serializedState));
  } catch {
    // Ignore storage failures so the store still works in restricted environments.
  }
}

export function createPocketStore<TState extends PocketState>(
  initialState: TState,
  options: PocketOptions<TState> = {}
): PocketStore<TState> {
  const config = { debug: false, ...options };
  const initialSnapshot = cloneInitialState(initialState);
  let state = mergePersistedState(initialSnapshot, config.persist);
  const keyListeners = new Map<PocketKey<TState>, Set<PocketListener<TState>>>();
  const storeListeners = new Set<PocketListener<TState>>();

  const getState = () => state as Readonly<TState>;
  const getSelected = <TSelected>(selector: PocketSelector<TState, TSelected>) => selector(state);

  const emitChange = (changedKeys: PocketKey<TState>[], previousState: TState) => {
    if (changedKeys.length === 0) {
      return;
    }

    persistState(state, config.persist);

    const listenersToNotify = new Set(storeListeners);

    for (const key of changedKeys) {
      const listeners = keyListeners.get(key);

      if (!listeners) {
        continue;
      }

      for (const listener of listeners) {
        listenersToNotify.add(listener);
      }
    }

    for (const listener of listenersToNotify) {
      listener(state, previousState, changedKeys);
    }

    if (config.debug) {
      for (const key of changedKeys) {
        console.log(`[OtterPocket] ${String(key)} ->`, state[key]);
      }
    }
  };

  const subscribe = (listener: PocketListener<TState>, key?: PocketKey<TState>) => {
    if (typeof listener !== "function") {
      throw new TypeError("OtterPocket subscribe() expects a function listener.");
    }

    if (typeof key === "undefined") {
      storeListeners.add(listener);
      return () => {
        storeListeners.delete(listener);
      };
    }

    const listeners = getKeyListenerSet(keyListeners, key);
    listeners.add(listener);

    return () => {
      listeners.delete(listener);

      if (listeners.size === 0) {
        keyListeners.delete(key);
      }
    };
  };

  const subscribeToSelector = <TSelected>(
    selector: PocketSelector<TState, TSelected>,
    listener: (
      selectedValue: TSelected,
      previousSelectedValue: TSelected,
      state: Readonly<TState>,
      previousState: Readonly<TState>,
      changedKeys: PocketKey<TState>[]
    ) => void,
    equalityFn: PocketEqualityFn<TSelected> = defaultEqualityFn
  ) => {
    let currentSelected = selector(state);

    return subscribe((nextState, previousState, changedKeys) => {
      const nextSelected = selector(nextState);

      if (equalityFn(currentSelected, nextSelected)) {
        return;
      }

      const previousSelected = currentSelected;
      currentSelected = nextSelected;
      listener(nextSelected, previousSelected, nextState, previousState, changedKeys);
    });
  };

  const get = <K extends PocketKey<TState>>(key: K) => state[key];

  const set = <K extends PocketKey<TState>>(key: K, nextValue: PocketUpdater<TState[K]>) => {
    const resolvedValue = resolveNextValue(state[key], nextValue);

    if (Object.is(state[key], resolvedValue)) {
      return state[key];
    }

    const previousState = state;
    state = {
      ...state,
      [key]: resolvedValue,
    };

    emitChange([key], previousState);
    return state[key];
  };

  const setState = (nextState: PocketStateUpdater<TState>) => {
    const resolvedState =
      typeof nextState === "function" ? nextState(state as Readonly<TState>) : nextState;

    if (
      resolvedState === null ||
      typeof resolvedState !== "object" ||
      Array.isArray(resolvedState)
    ) {
      throw new TypeError("OtterPocket setState() expects an object or updater function.");
    }

    const nextSnapshot = {
      ...state,
      ...resolvedState,
    };
    const changedKeys = (Object.keys(nextSnapshot) as PocketKey<TState>[]).filter(
      (key) => !Object.is(state[key], nextSnapshot[key])
    );

    if (changedKeys.length === 0) {
      return state as Readonly<TState>;
    }

    const previousState = state;
    state = nextSnapshot;
    emitChange(changedKeys, previousState);

    return state as Readonly<TState>;
  };

  const toggle = <K extends PocketKey<TState>>(key: K) =>
    set(key, ((currentValue: TState[K]) => !currentValue) as PocketUpdater<TState[K]>);

  const inc = <K extends PocketKey<TState>>(key: K) =>
    set(
      key,
      ((currentValue: TState[K]) => (Number(currentValue ?? 0) + 1) as TState[K]) as PocketUpdater<TState[K]>
    );

  const dec = <K extends PocketKey<TState>>(key: K) =>
    set(
      key,
      ((currentValue: TState[K]) => (Number(currentValue ?? 0) - 1) as TState[K]) as PocketUpdater<TState[K]>
    );

  const push = <K extends PocketKey<TState>>(key: K, item: unknown) =>
    set(
      key,
      ((currentValue: TState[K]) =>
        [...(Array.isArray(currentValue) ? currentValue : []), item] as TState[K]) as PocketUpdater<TState[K]>
    );

  const remove = <K extends PocketKey<TState>>(
    key: K,
    indexOrPredicate: number | ((item: unknown, index: number) => boolean)
  ) =>
    set(
      key,
      ((currentValue: TState[K]) => {
        const arrayValue = Array.isArray(currentValue) ? [...currentValue] : [];

        if (typeof indexOrPredicate === "function") {
          return arrayValue.filter((item, index) => !indexOrPredicate(item, index)) as TState[K];
        }

        arrayValue.splice(indexOrPredicate, 1);
        return arrayValue as TState[K];
      }) as PocketUpdater<TState[K]>
    );

  const reset = <K extends PocketKey<TState>>(key: K) => set(key, initialSnapshot[key]);
  const resetAll = () => setState(initialSnapshot);

  return {
    get,
    getState,
    getSelected,
    set,
    setState,
    subscribe,
    subscribeToSelector,
    toggle,
    inc,
    dec,
    push,
    remove,
    reset,
    resetAll,
  };
}

export function persist<TState extends PocketState>(
  key: string,
  options: Omit<PocketPersistOptions<TState>, "key"> = {}
): PocketPersistOptions<TState> {
  return {
    key,
    ...options,
  };
}
