import DemoCounter from "../examples/DemoCounter.jsx";
import DemoTodo from "../examples/DemoTodo.jsx";
import DemoTheme from "../examples/DemoTheme.jsx";
import DemoPersisted from "../examples/DemoPersisted.jsx";

function ExamplesSection({ otterImage }) {
  return (
    <section className="section section-anchor" id="examples">
      <div className="section-heading">
        <span className="eyebrow">Examples</span>
        <h2>What you can do with it, step by step.</h2>
        <p>Separate blocks. Separate colors. Small code chunks.</p>
      </div>
      <div className="examples-stack">
        <DemoCounter />
        <DemoTodo />
        <DemoTheme otterImage={otterImage} />
        <DemoPersisted otterImage={otterImage} />
      </div>
    </section>
  );
}

export default ExamplesSection;
