import CopyButton from "./CopyButton.jsx";

function StepBlocks({ steps }) {
  return (
    <div className="step-grid">
      {steps.map((step) => (
        <article className={`step-card tone-${step.tone}`} key={step.title}>
          <div className="code-card-head">
            <h4>{step.title}</h4>
            <CopyButton className="snippet-copy" text={step.code} />
          </div>
          <p>{step.body}</p>
          <pre>
            <code>{step.code}</code>
          </pre>
        </article>
      ))}
    </div>
  );
}

export default StepBlocks;
