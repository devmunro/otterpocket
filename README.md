# OtterPocket

OtterPocket is a small, friendly React state library with a tiny API, built-in helpers, selector support, and optional persistence.

It is meant to feel lighter than Redux and more welcoming than lower-level store libraries.

## Installation

```bash
npm install otterpocket react
```

## Quick Start

```tsx
import { createPocket, persist } from "otterpocket";

const pocket = createPocket(
  {
    count: 0,
    todos: [] as string[],
    darkMode: false,
  },
  {
    persist: persist("otterpocket-demo"),
  }
);

export function App() {
  const count = pocket.use("count");
  const darkMode = pocket.use((state) => state.darkMode);
  const todoCount = pocket.use((state) => state.todos.length);

  return (
    <div data-theme={darkMode ? "dark" : "light"}>
      <h1>Count: {count}</h1>
      <p>Todos: {todoCount}</p>
      <button onClick={() => pocket.inc("count")}>+</button>
      <button onClick={() => pocket.push("todos", "Collect shells")}>
        Add todo
      </button>
      <button onClick={() => pocket.toggle("darkMode")}>
        Toggle theme
      </button>
    </div>
  );
}
```

## Highlights

- `use("key")` for simple keyed subscriptions
- `use(selector)` for derived subscriptions
- `persist("name")` for localStorage-backed state
- `inc`, `dec`, `toggle`, `push`, `remove`, `reset`, `resetAll`
- `getState`, `setState`, and selector subscriptions for more advanced usage

## API

### `createPocket(initialState, options?)`

Creates a React-ready store.

Options:

- `debug?: boolean` logs changed keys during development
- `persist?: persist("storage-key", options)` enables persistence

Returns:

- `use(key)` subscribe to a single key in React
- `use(selector, equalityFn?)` subscribe to derived state
- `get(key)` read one value
- `getState()` read the whole state object
- `getSelected(selector)` read a derived value outside React
- `set(key, valueOrUpdater)` update one key
- `setState(partialOrUpdater)` merge a partial state object
- `subscribe(listener, key?)` subscribe to the whole store or a specific key
- `subscribeToSelector(selector, listener, equalityFn?)` subscribe to derived values outside React
- `toggle(key)` flip a boolean value
- `inc(key)` increment a numeric value
- `dec(key)` decrement a numeric value
- `push(key, item)` append to an array
- `remove(key, indexOrPredicate)` remove from an array
- `reset(key)` reset one key to its initial value
- `resetAll()` reset the entire store

### `persist(key, options?)`

Creates a persistence config you can pass into `createPocket` or `createPocketStore`.

Options:

- `storage?: { getItem, setItem, removeItem? }`
- `partialize?: (state) => partialState`

## Example: Store Access Outside React

```ts
import { createPocketStore, persist } from "otterpocket/core";

const pocket = createPocketStore(
  { count: 0, filter: "all" },
  {
    persist: persist("otter-store"),
  }
);

const stop = pocket.subscribeToSelector(
  (state) => `${state.filter}:${state.count}`,
  (nextValue) => {
    console.log("Selected value changed:", nextValue);
  }
);

pocket.inc("count");
stop();
```

## Scripts

```bash
npm run build
npm test
```

## Notes

- React is a peer dependency.
- The package ships built files from `dist/`.
- Keyed subscriptions only fire for keys that changed.
- Selector subscriptions only fire when the selected value changes.
