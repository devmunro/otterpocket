export type PocketState = Record<string, unknown>;
export type PocketKey<TState extends PocketState> = Extract<keyof TState, string>;
export type PocketUpdater<TValue> = TValue | ((currentValue: TValue) => TValue);
export type PocketStateUpdater<TState extends PocketState> =
  | Partial<TState>
  | ((currentState: Readonly<TState>) => Partial<TState>);

export interface PocketOptions {
  debug?: boolean;
}

export type PocketListener<TState extends PocketState> = (
  state: Readonly<TState>,
  previousState: Readonly<TState>,
  changedKeys: PocketKey<TState>[]
) => void;

export interface PocketStore<TState extends PocketState> {
  get<K extends PocketKey<TState>>(key: K): TState[K];
  getState(): Readonly<TState>;
  set<K extends PocketKey<TState>>(key: K, nextValue: PocketUpdater<TState[K]>): TState[K];
  setState(nextState: PocketStateUpdater<TState>): Readonly<TState>;
  subscribe(listener: PocketListener<TState>, key?: PocketKey<TState>): () => void;
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

export function createPocketStore<TState extends PocketState>(
  initialState: TState,
  options: PocketOptions = {}
): PocketStore<TState> {
  const config = { debug: false, ...options };
  const initialSnapshot = cloneInitialState(initialState);
  let state = cloneInitialState(initialSnapshot);
  const keyListeners = new Map<PocketKey<TState>, Set<PocketListener<TState>>>();
  const storeListeners = new Set<PocketListener<TState>>();

  const getState = () => state as Readonly<TState>;

  const emitChange = (changedKeys: PocketKey<TState>[], previousState: TState) => {
    if (changedKeys.length === 0) {
      return;
    }

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
    set(key, ((currentValue: TState[K]) => (Number(currentValue ?? 0) + 1) as TState[K]) as PocketUpdater<TState[K]>);

  const dec = <K extends PocketKey<TState>>(key: K) =>
    set(key, ((currentValue: TState[K]) => (Number(currentValue ?? 0) - 1) as TState[K]) as PocketUpdater<TState[K]>);

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
    set,
    setState,
    subscribe,
    toggle,
    inc,
    dec,
    push,
    remove,
    reset,
    resetAll,
  };
}
