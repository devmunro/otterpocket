import StepBlocks from "./StepBlocks.jsx";

function ExampleBlock({ badge, title, useCase, summary, steps, children }) {
  return (
    <article className="example-card">
      <div className="example-copy">
        <div className="demo-top">
          <span className="demo-badge">{badge}</span>
          <div>
            <h3>{title}</h3>
            <p>{useCase}</p>
          </div>
        </div>
        <p className="example-summary">{summary}</p>
        <StepBlocks steps={steps} />
      </div>
      <div className="example-preview-card">
        <div className="preview-head">
          <span>Live example</span>
        </div>
        <div className="example-preview">{children}</div>
      </div>
    </article>
  );
}

export default ExampleBlock;
