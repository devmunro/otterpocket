import { useSyncExternalStore } from "react";
import { createPocketStore } from "./core.js";

import type { PocketKey, PocketOptions, PocketState, PocketStore } from "./core.js";

export type {
  PocketKey,
  PocketListener,
  PocketOptions,
  PocketState,
  PocketStateUpdater,
  PocketStore,
  PocketUpdater,
} from "./core.js";

export { createPocketStore } from "./core.js";

export interface ReactPocketStore<TState extends PocketState> extends PocketStore<TState> {
  use<K extends PocketKey<TState>>(key: K): TState[K];
}

export function createPocket<TState extends PocketState>(
  initialState: TState,
  options: PocketOptions = {}
): ReactPocketStore<TState> {
  const store = createPocketStore(initialState, options);

  return {
    ...store,
    use<K extends PocketKey<TState>>(key: K) {
      return useSyncExternalStore(
        (listener) => store.subscribe(listener, key),
        () => store.get(key),
        () => store.get(key)
      );
    },
  };
}
