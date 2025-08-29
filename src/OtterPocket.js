import React, {
  useSyncExternalStore,
  useRef,
  useEffect,
  useState,
} from "react";

function shallowEqual(a, b) {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // Handle plain objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!(key in b) || a[key] !== b[key]) return false;
  }

  return true;
}

// OtterPocket Core
export function createPocket(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();

  // Notify all subscribers
  const notify = (key) => {
    listeners.forEach((cb) => cb(state[key]));
    console.log(`🦦 [OtterPocket] ${key} →`, state[key]);
  };

  // Get value
  const get = (key) => state[key];

  // Set value
  const set = (key, value) => {
    state[key] = value;
    notify(key);
  };

  // Use hook
  const use = (key) => {
    const lastSelectedRef = useRef(state[key]);
    const [, setValue] = useState(state[key]);

    useEffect(() => {
      const callback = (val) => {
        if (!shallowEqual(lastSelectedRef.current, val)) {
          lastSelectedRef.current = val;
          setValue(val);
        }
      };
      listeners.add(callback);
      return () => listeners.delete(callback);
    }, [key]);

    return state[key];
  };

  // Sugar helpers
  const toggle = (key) => set(key, !state[key]);
  const inc = (key) => set(key, (state[key] || 0) + 1);
  const dec = (key) => set(key, (state[key] || 0) - 1);
  const push = (key, item) => set(key, [...(state[key] || []), item]);
  const remove = (key, indexOrPredicate) => {
    const arr = Array.isArray(state[key]) ? [...state[key]] : [];
    if (typeof indexOrPredicate === "function") {
      set(
        key,
        arr.filter((i) => !indexOrPredicate(i))
      );
    } else {
      arr.splice(indexOrPredicate, 1);
      set(key, arr);
    }
  };
  const reset = (key) => set(key, initialState[key]);
  const resetAll = () =>
    Object.keys(initialState).forEach((k) => set(k, initialState[k]));

  
  return {
    get,
    set,
    use,
    subscribe: (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    toggle,
    inc,
    dec,
    push,
    remove,
    reset,
    resetAll,
  };
}
