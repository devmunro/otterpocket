export const HERO_SNIPPET = `import { createPocket } from "otterpocket";

const pocket = createPocket({
  darkMode: false,
  todos: [],
  todoFilter: "all",
});`;

export const COUNTER_STEPS = [
  {
    title: "1. Create the state",
    body: "Start with one number in the store.",
    code: `const pocket = createPocket({\n  count: 0,\n});`,
    tone: "blue",
  },
  {
    title: "2. Read the state",
    body: "Use one key inside the component.",
    code: `const count = pocket.use("count");`,
    tone: "sand",
  },
  {
    title: "3. Update the state",
    body: "Use helpers instead of boilerplate.",
    code: `pocket.inc("count");\npocket.dec("count");\npocket.reset("count");`,
    tone: "kelp",
  },
];

export const TODO_STEPS = [
  {
    title: "1. Store the list",
    body: "Keep the todos and the filter in the same store.",
    code: `const pocket = createPocket({\n  todos: [],\n  todoFilter: "all",\n});`,
    tone: "blue",
  },
  {
    title: "2. Add items",
    body: "Push new items into the array.",
    code: `pocket.push("todos", {\n  id: Date.now(),\n  label: "Ship docs",\n  done: false,\n});`,
    tone: "sand",
  },
  {
    title: "3. Toggle done",
    body: "Read the array, build the next one, then set it back.",
    code: `const nextTodos = pocket.get("todos").map((todo) =>\n  todo.id === id ? { ...todo, done: !todo.done } : todo\n);\n\npocket.set("todos", nextTodos);`,
    tone: "kelp",
  },
  {
    title: "4. Filter the UI",
    body: "Use another key for what the list should show.",
    code: `pocket.set("todoFilter", "open");\npocket.set("todoFilter", "done");`,
    tone: "slate",
  },
];

export const THEME_STEPS = [
  {
    title: "1. Put theme in the store",
    body: "This is site state, not button state.",
    code: `const pocket = createPocket({\n  darkMode: false,\n});`,
    tone: "blue",
  },
  {
    title: "2. Read it at the top",
    body: "Let the site shell or layout read the key.",
    code: `const darkMode = pocket.use("darkMode");`,
    tone: "sand",
  },
  {
    title: "3. Apply it everywhere",
    body: "Use one class on the root and style the whole page from it.",
    code: `<div className={darkMode ? "site dark" : "site"}>`,
    tone: "kelp",
  },
  {
    title: "4. Toggle it from the header",
    body: "Any component can change the same key.",
    code: `pocket.toggle("darkMode");`,
    tone: "slate",
  },
];

export const PERSIST_STEPS = [
  {
    title: "1. Store preferences",
    body: "Theme, compact mode, reduced motion.",
    code: `const pocket = createPocket({\n  theme: "river",\n  compact: false,\n  reducedMotion: false,\n});`,
    tone: "blue",
  },
  {
    title: "2. Subscribe to changes",
    body: "Listen outside React components.",
    code: `pocket.subscribe((state) => {\n  localStorage.setItem("settings", JSON.stringify(state));\n});`,
    tone: "sand",
  },
  {
    title: "3. Restore on load",
    body: "Read storage before creating the store.",
    code: `const saved = JSON.parse(localStorage.getItem("settings") ?? "{}");`,
    tone: "kelp",
  },
];

export const apiMethods = [
  {
    name: "createPocket(initialState, options?)",
    description:
      "Creates a store from a plain object. You use the returned store everywhere else.",
    details: [
      "Use this once for each store.",
      "The initial object becomes the starting state.",
      "Pass `{ debug: true }` if you want change logs.",
    ],
    code: `const pocket = createPocket({\n  count: 0,\n  darkMode: false,\n});`,
  },
  {
    name: 'pocket.use("key")',
    description: "Reads one key inside a React component and re-renders when that key changes.",
    details: [
      "Best for component subscriptions.",
      "Keeps the mental model simple.",
      "One key in, one value out.",
    ],
    code: `function Counter() {\n  const count = pocket.use("count");\n  return <span>{count}</span>;\n}`,
  },
  {
    name: 'pocket.set("key", value)',
    description: "Updates one key by replacing it with the value you pass in.",
    details: [
      "Pass the next value directly.",
      "Use `get(key)` first if you need the current value.",
      "Works with numbers, booleans, arrays, and objects.",
    ],
    code: `pocket.set("count", 4);\npocket.set("count", pocket.get("count") + 1);`,
  },
  {
    name: 'pocket.get("key")',
    description: "Reads the current value outside render logic.",
    details: [
      "Useful in event handlers.",
      "Useful when building the next array or object.",
      "Good for non-React code too.",
    ],
    code: `const todos = pocket.get("todos");`,
  },
  {
    name: "Helper methods",
    description: "Shortcuts for common state updates.",
    details: [
      "`inc(key)` and `dec(key)` for numbers.",
      "`toggle(key)` for booleans.",
      "`push(key, item)` and `remove(key, matcher)` for arrays.",
      "`reset(key)` and `resetAll()` to restore defaults.",
    ],
    code: `pocket.inc("count");\npocket.toggle("darkMode");\npocket.push("todos", item);\npocket.remove("todos", (todo) => todo.done);`,
  },
  {
    name: "pocket.subscribe(listener)",
    description: "Runs a listener when the store changes.",
    details: [
      "Useful for persistence.",
      "Useful for analytics or devtools.",
      "Returns an unsubscribe function.",
    ],
    code: `const stop = pocket.subscribe((state) => {\n  localStorage.setItem("settings", JSON.stringify(state));\n});`,
  },
];
