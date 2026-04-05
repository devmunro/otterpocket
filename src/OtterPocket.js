import { useSyncExternalStore } from "react";

function cloneInitialState(initialState) {
  return { ...initialState };
}

function getKeyListenerSet(keyListeners, key) {
  if (!keyListeners.has(key)) {
    keyListeners.set(key, new Set());
  }

  return keyListeners.get(key);
}

function resolveNextValue(currentValue, nextValue) {
  return typeof nextValue === "function" ? nextValue(currentValue) : nextValue;
}

export function createPocket(initialState = {}, options = {}) {
  const config =
    options && typeof options === "object" ? { debug: false, ...options } : { debug: false };

  const initialSnapshot = cloneInitialState(initialState);
  let state = cloneInitialState(initialSnapshot);
  const keyListeners = new Map();
  const storeListeners = new Set();

  const getState = () => state;

  const emitChange = (changedKeys, previousState) => {
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

  const subscribe = (listener, key) => {
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

  const get = (key) => state[key];

  const set = (key, nextValue) => {
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

  const setState = (nextState) => {
    const resolvedState = resolveNextValue(state, nextState);

    if (
      resolvedState === null ||
      typeof resolvedState !== "object" ||
      Array.isArray(resolvedState)
    ) {
      throw new TypeError("OtterPocket setState() expects an object or updater function.");
    }

    const nextSnapshot = { ...state, ...resolvedState };
    const changedKeys = Object.keys(nextSnapshot).filter(
      (key) => !Object.is(state[key], nextSnapshot[key])
    );

    if (changedKeys.length === 0) {
      return state;
    }

    const previousState = state;
    state = nextSnapshot;
    emitChange(changedKeys, previousState);

    return state;
  };

  const use = (key) =>
    useSyncExternalStore(
      (listener) => subscribe(listener, key),
      () => state[key],
      () => state[key]
    );

  const toggle = (key) => set(key, (currentValue) => !currentValue);
  const inc = (key) => set(key, (currentValue = 0) => currentValue + 1);
  const dec = (key) => set(key, (currentValue = 0) => currentValue - 1);
  const push = (key, item) =>
    set(key, (currentValue = []) => [...(Array.isArray(currentValue) ? currentValue : []), item]);
  const remove = (key, indexOrPredicate) =>
    set(key, (currentValue = []) => {
      const arrayValue = Array.isArray(currentValue) ? [...currentValue] : [];

      if (typeof indexOrPredicate === "function") {
        return arrayValue.filter((item, index) => !indexOrPredicate(item, index));
      }

      arrayValue.splice(indexOrPredicate, 1);
      return arrayValue;
    });
  const reset = (key) => set(key, initialSnapshot[key]);
  const resetAll = () => setState(initialSnapshot);

  return {
    get,
    getState,
    set,
    setState,
    use,
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
