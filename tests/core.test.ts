// @ts-nocheck
import assert from "node:assert/strict";

import { createPocketStore } from "../src/core.js";

function runTest(name, callback) {
  try {
    callback();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest("keyed subscriptions only fire for the key that changed", () => {
  const pocket = createPocketStore({ count: 0, todos: [] });
  let countHits = 0;
  let todoHits = 0;

  const stopCount = pocket.subscribe(() => {
    countHits += 1;
  }, "count");
  const stopTodos = pocket.subscribe(() => {
    todoHits += 1;
  }, "todos");

  pocket.inc("count");
  pocket.push("todos", "shell");

  stopCount();
  stopTodos();

  assert.equal(countHits, 1);
  assert.equal(todoHits, 1);
});

runTest("set and setState accept updater functions", () => {
  const pocket = createPocketStore({ count: 1, darkMode: false });

  pocket.set("count", (count) => count + 4);
  pocket.setState((state) => ({
    count: state.count + 1,
    darkMode: !state.darkMode,
  }));

  assert.equal(pocket.get("count"), 6);
  assert.equal(pocket.get("darkMode"), true);
});

runTest("helpers update and reset state predictably", () => {
  const pocket = createPocketStore({
    count: 2,
    darkMode: false,
    todos: ["shell", "stone"],
  });

  pocket.dec("count");
  pocket.toggle("darkMode");
  pocket.push("todos", "kelp");
  pocket.remove("todos", (item) => item === "stone");

  assert.equal(pocket.get("count"), 1);
  assert.equal(pocket.get("darkMode"), true);
  assert.deepEqual(pocket.get("todos"), ["shell", "kelp"]);

  pocket.reset("count");
  pocket.resetAll();

  assert.equal(pocket.get("count"), 2);
  assert.equal(pocket.get("darkMode"), false);
  assert.deepEqual(pocket.get("todos"), ["shell", "stone"]);
});
