import ExampleBlock from "../common/ExampleBlock.jsx";
import { COUNTER_STEPS } from "../../data/siteContent.js";
import { pocket } from "../../store/pockets.js";

function DemoCounter() {
  const count = pocket.use("count");

  return (
    <ExampleBlock
      badge="01"
      title="Counter"
      useCase="Numeric state"
      summary="Use this for quantities, pagination, sliders, tabs, or any number that changes."
      steps={COUNTER_STEPS}
    >
      <div className="counter-value">{count}</div>
      <div className="button-row">
        <button onClick={() => pocket.dec("count")} type="button">
          -1
        </button>
        <button onClick={() => pocket.inc("count")} type="button">
          +1
        </button>
        <button className="ghost-button" onClick={() => pocket.reset("count")} type="button">
          Reset
        </button>
      </div>
    </ExampleBlock>
  );
}

export default DemoCounter;
