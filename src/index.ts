import { useSyncExternalStore } from "react";
import { createPocketStore, persist } from "./core.js";

import type {
  PocketEqualityFn,
  PocketKey,
  PocketOptions,
  PocketSelector,
  PocketState,
  PocketStore,
} from "./core.js";

export type {
  PocketEqualityFn,
  PocketKey,
  PocketListener,
  PocketOptions,
  PocketPersistOptions,
  PocketSelector,
  PocketState,
  PocketStateUpdater,
  PocketStore,
  PocketStorage,
  PocketUpdater,
} from "./core.js";

export { createPocketStore, persist } from "./core.js";

export interface ReactPocketStore<TState extends PocketState> extends PocketStore<TState> {
  use<K extends PocketKey<TState>>(key: K): TState[K];
  use<TSelected>(
    selector: PocketSelector<TState, TSelected>,
    equalityFn?: PocketEqualityFn<TSelected>
  ): TSelected;
}

export function createPocket<TState extends PocketState>(
  initialState: TState,
  options: PocketOptions<TState> = {}
): ReactPocketStore<TState> {
  const store = createPocketStore(initialState, options);

  function use<TSelectedOrKey extends PocketKey<TState>, TSelected>(
    keyOrSelector: TSelectedOrKey | PocketSelector<TState, TSelected>,
    equalityFn?: PocketEqualityFn<TSelected>
  ) {
    if (typeof keyOrSelector === "function") {
      const selector = keyOrSelector as PocketSelector<TState, TSelected>;
      const isEqual = equalityFn ?? Object.is;

      return useSyncExternalStore(
        (listener) =>
          store.subscribeToSelector(
            selector,
            () => {
              listener();
            },
            isEqual
          ),
        () => store.getSelected(selector),
        () => store.getSelected(selector)
      );
    }

    const key = keyOrSelector as PocketKey<TState>;

    return useSyncExternalStore(
      (listener) => store.subscribe(listener, key),
      () => store.get(key),
      () => store.get(key)
    );
  }

  return {
    ...store,
    use,
  };
}
