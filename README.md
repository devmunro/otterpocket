# OtterPocket

![otter](https://github.com/user-attachments/assets/dab30de0-2cbe-4b63-b2b0-a22079855907)

Small, friendly React state management with a tiny API, useful helpers, selectors, and optional persistence.



OtterPocket is for app and UI state that should feel simple to read and simple to update.
Use it for:

- counters
- todo lists
- filters
- dark mode
- saved settings
- session or header state

It aims to feel lighter than Redux and more guided than lower-level stores.

## Install

```bash
npm install otterpocket
```

## Quick Example

```tsx
import { createPocket, persist } from "otterpocket";

const pocket = createPocket(
  {
    count: 0,
    todos: [] as { id: number; label: string; done: boolean }[],
    todoFilter: "all" as "all" | "open" | "done",
    darkMode: false,
  },
  {
    persist: persist("otterpocket-demo"),
  }
);

function TodoApp() {
  const todos = pocket.use("todos");
  const todoFilter = pocket.use("todoFilter");
  const darkMode = pocket.use("darkMode");

  const visibleTodos = todos.filter((todo) => {
    if (todoFilter === "open") return !todo.done;
    if (todoFilter === "done") return todo.done;
    return true;
  });

  const toggleTodo = (id: number) => {
    pocket.set(
      "todos",
      pocket.get("todos").map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  return (
    <div data-theme={darkMode ? "dark" : "light"}>
      <h1>OtterPocket</h1>

      <div>
        <button onClick={() => pocket.inc("count")}>Count up</button>
        <button onClick={() => pocket.toggle("darkMode")}>Toggle dark mode</button>
        <button onClick={() => pocket.set("todoFilter", "open")}>Open only</button>
      </div>

      <ul>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>
            <button onClick={() => toggleTodo(todo.id)}>{todo.done ? "✓" : "○"}</button>
            <span>{todo.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Why People Would Use It

- `use("key")` keeps simple state simple
- `use(selector)` handles derived values without extra setup
- helpers like `inc`, `toggle`, `push`, and `remove` cut boilerplate
- `persist()` gives you localStorage-backed state without extra wiring
- `createPocketStore()` works outside React too

## Core API

### `createPocket(initialState, options?)`

Creates a React-ready store.

```ts
const pocket = createPocket({
  count: 0,
  darkMode: false,
});
```

Options:

- `debug?: boolean`
- `persist?: persist("storage-key", options)`

### `pocket.use("key")`

Subscribe to one key in a React component.

```ts
const count = pocket.use("count");
```

### `pocket.use(selector, equalityFn?)`

Subscribe to derived state.

```ts
const doneCount = pocket.use((state) => state.todos.filter((todo) => todo.done).length);
```

### `pocket.set("key", valueOrUpdater)`

Update one key.

```ts
pocket.set("count", 4);
pocket.set("count", (current) => current + 1);
```

### `pocket.get("key")`

Read a current value outside render.

```ts
const todos = pocket.get("todos");
```

### Helpers

```ts
pocket.inc("count");
pocket.dec("count");
pocket.toggle("darkMode");
pocket.push("todos", { id: 1, label: "Ship docs", done: false });
pocket.remove("todos", (todo) => todo.done);
pocket.reset("count");
pocket.resetAll();
```

### `pocket.subscribe(listener, key?)`

Listen to state changes.

```ts
const stop = pocket.subscribe((state) => {
  localStorage.setItem("settings", JSON.stringify(state));
});
```

### `persist(key, options?)`

Create persistence config for `createPocket()` or `createPocketStore()`.

```ts
const pocket = createPocket(
  { darkMode: false },
  {
    persist: persist("otter-ui"),
  }
);
```

## Outside React

OtterPocket also exposes a core store for non-React usage.

```ts
import { createPocketStore, persist } from "otterpocket/core";

const store = createPocketStore(
  { count: 0, filter: "all" },
  {
    persist: persist("otter-store"),
  }
);

const stop = store.subscribeToSelector(
  (state) => `${state.filter}:${state.count}`,
  (nextValue) => {
    console.log("Selected value changed:", nextValue);
  }
);

store.inc("count");
stop();
```

## Notes

- React is a peer dependency.
