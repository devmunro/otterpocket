import ExampleBlock from "../common/ExampleBlock.jsx";
import { THEME_STEPS } from "../../data/siteContent.js";
import { pocket } from "../../store/pockets.js";

function DemoTheme({ otterImage }) {
  const darkMode = pocket.use("darkMode");

  return (
    <ExampleBlock
      badge="03"
      title="Whole-site dark mode"
      useCase="Theme state"
      summary="Use one key to switch the whole page between light and dark."
      steps={THEME_STEPS}
    >
      <div className={darkMode ? "site-preview dark" : "site-preview"}>
        <div className="site-preview-bar">
          <div className="site-preview-brand">
            <img alt="OtterPocket logo" className="site-preview-face" src={otterImage} />
            <span className="site-preview-name">OtterPocket</span>
          </div>
          <button onClick={() => pocket.toggle("darkMode")} type="button">
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
        <div className="site-preview-body">
          <div className="site-preview-panel">Header</div>
          <div className="site-preview-panel">Content</div>
          <div className="site-preview-panel">Cards</div>
        </div>
      </div>
    </ExampleBlock>
  );
}

export default DemoTheme;
