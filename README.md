# 🦦 OtterPocket

![output](https://github.com/user-attachments/assets/015a782b-4ecd-4c64-937a-7ee1a989abdf)

OtterPocket is a **super simple and beginner-friendly state management library for React**.  
It lets you manage state with **counters, lists, toggles, and more** — no Redux, no boilerplate. Perfect for **learning, teaching, or small projects**.

---

## ✨ Features

- 🟢 Reactive `use` hook to subscribe to state keys  
- 🔑 Handy helpers:
  - ➕ `inc(key)` — increment a number  
  - ➖ `dec(key)` — decrement a number  
  - 🔄 `toggle(key)` — toggle a boolean  
  - 📝 `push(key, item)` — add an item to an array  
  - ❌ `remove(key, indexOrPredicate)` — remove an item from an array  
  - 🔄 `reset(key)` — reset a key to its initial value  
  - 🏁 `resetAll()` — reset **all keys** to their initial values  

---

## 📦 Installation

```bash
npm install otterpocket
```
```
yarn add otterpocket
```

---

## 🚀 Basic Usage

```Javascript
import React from "react";
import { createPocket } from "otterpocket";

const pocket = createPocket({ count: 0, todos: [], darkMode: false });

function App() {
  const count = pocket.use("count");
  const todos = pocket.use("todos");
  const darkMode = pocket.use("darkMode");

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => pocket.inc("count")}>➕</button>
      <button onClick={() => pocket.dec("count")}>➖</button>
      <button onClick={() => pocket.reset("count")}>🔄 Reset</button>

      <h2>Todo List</h2>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo} <button onClick={() => pocket.remove("todos", i)}>❌</button>
          </li>
        ))}
      </ul>
      <button onClick={() => pocket.push("todos", "🐟 Fish")}>Add Todo</button>

      <h2>Dark Mode</h2>
      <button onClick={() => pocket.toggle("darkMode")}>
        {darkMode ? "🌙 ON" : "☀️ OFF"}
      </button>
    </div>
  );
}

export default App;

```

---
