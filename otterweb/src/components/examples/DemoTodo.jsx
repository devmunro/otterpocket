import ExampleBlock from "../common/ExampleBlock.jsx";
import { TODO_STEPS } from "../../data/siteContent.js";
import { DEMO_TODOS, pocket } from "../../store/pockets.js";

function DemoTodo() {
  const todos = pocket.use("todos");
  const draft = pocket.use("todoDraft");
  const todoFilter = pocket.use("todoFilter");

  const visibleTodos = todos.filter((todo) => {
    if (todoFilter === "open") return !todo.done;
    if (todoFilter === "done") return todo.done;
    return true;
  });

  const submitTodo = () => {
    const next = draft.trim();
    if (!next) return;
    pocket.push("todos", { id: Date.now(), label: next, done: false });
    pocket.set("todoDraft", "");
  };

  const removeTodo = (id) => {
    const remaining = todos.filter((item) => item.id !== id);
    if (remaining.length === 0) {
      pocket.set("todos", DEMO_TODOS);
      pocket.set("todoFilter", "all");
      return;
    }

    pocket.set("todos", remaining);
  };

  const toggleTodo = (id) => {
    const nextTodos = todos.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    pocket.set("todos", nextTodos);
  };

  return (
    <ExampleBlock
      badge="02"
      title="Todo list"
      useCase="List state + filter state"
      summary="The list and the filter live in the same store, so the UI stays simple."
      steps={TODO_STEPS}
    >
      <div className="todo-demo">
        <div className="field-row">
          <input
            onChange={(event) => pocket.set("todoDraft", event.target.value)}
            placeholder="Add task"
            value={draft}
          />
          <button onClick={submitTodo} type="button">
            Add
          </button>
        </div>
        <div className="segmented">
          {["all", "open", "done"].map((filter) => (
            <button
              className={todoFilter === filter ? "active" : ""}
              key={filter}
              onClick={() => pocket.set("todoFilter", filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <ul className="todo-list">
          {visibleTodos.length > 0 ? (
            visibleTodos.map((todo) => (
              <li className={todo.done ? "todo-item done" : "todo-item"} key={todo.id}>
                <button
                  aria-label={todo.done ? "Mark todo as open" : "Mark todo as done"}
                  className="todo-toggle"
                  onClick={() => toggleTodo(todo.id)}
                  type="button"
                >
                  {todo.done ? "✓" : ""}
                </button>
                <button
                  aria-label={todo.done ? "Mark todo as open" : "Mark todo as done"}
                  className="todo-label"
                  onClick={() => toggleTodo(todo.id)}
                  type="button"
                >
                  {todo.label}
                </button>
                <button className="icon-button" onClick={() => removeTodo(todo.id)} type="button">
                  x
                </button>
              </li>
            ))
          ) : (
            <li className="todo-empty">
              <strong>No todos for this filter.</strong>
              <span>Try another filter or restore the demo list.</span>
              <button
                className="ghost-button"
                onClick={() => {
                  pocket.set("todos", DEMO_TODOS);
                  pocket.set("todoFilter", "all");
                }}
                type="button"
              >
                Restore demo
              </button>
            </li>
          )}
        </ul>
      </div>
    </ExampleBlock>
  );
}

export default DemoTodo;
