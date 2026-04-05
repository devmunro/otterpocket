# OtterPocket

OtterPocket is a small, friendly React state library with a tiny API and useful helpers.

It is designed for developers who want something lighter than Redux and more guided than a bare store.

## Installation

```bash
npm install otterpocket react
```

## Quick Start

```tsx
import { createPocket } from "otterpocket";

const pocket = createPocket({
  count: 0,
  todos: [] as string[],
  darkMode: false,
});

export function App() {
  const count = pocket.use("count");
  const todos = pocket.use("todos");
  const darkMode = pocket.use("darkMode");

  return (
    <div data-theme={darkMode ? "dark" : "light"}>
      <h1>Count: {count}</h1>
      <button onClick={() => pocket.inc("count")}>+</button>
      <button onClick={() => pocket.dec("count")}>-</button>
      <button onClick={() => pocket.push("todos", "Collect shells")}>
        Add todo
      </button>
      <button onClick={() => pocket.toggle("darkMode")}>
        Toggle theme
      </button>

      <ul>
        {todos.map((todo, index) => (
          <li key={todo + index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
```

## API

### `createPocket(initialState, options?)`

Creates a pocket store with React bindings.

Options:

- `debug?: boolean` logs changed keys during development

Returns:

- `use(key)` subscribe to a single key in React
- `get(key)` read one value
- `getState()` read the whole state object
- `set(key, valueOrUpdater)` update one key
- `setState(partialOrUpdater)` merge a partial state object
- `subscribe(listener, key?)` subscribe to the whole store or a specific key
- `toggle(key)` flip a boolean value
- `inc(key)` increment a numeric value
- `dec(key)` decrement a numeric value
- `push(key, item)` append to an array
- `remove(key, indexOrPredicate)` remove from an array
- `reset(key)` reset one key to its initial value
- `resetAll()` reset the entire store

## Example: Store Access Outside React

```ts
import { createPocketStore } from "otterpocket/core";

const pocket = createPocketStore({ count: 0 });

pocket.inc("count");
console.log(pocket.get("count"));
```

## Scripts

```bash
npm run build
npm test
```

## Notes

- React is a peer dependency.
- The package ships built files from `dist/`.
- Keyed subscriptions only fire for the keys that changed.
