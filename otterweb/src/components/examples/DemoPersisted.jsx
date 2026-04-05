import { useEffect } from "react";
import ExampleBlock from "../common/ExampleBlock.jsx";
import { PERSIST_STEPS } from "../../data/siteContent.js";
import { settingsPocket, STORAGE_KEY } from "../../store/pockets.js";

function DemoPersisted({ otterImage }) {
  const theme = settingsPocket.use("theme");
  const compact = settingsPocket.use("compact");
  const reducedMotion = settingsPocket.use("reducedMotion");

  useEffect(() => {
    const unsubscribe = settingsPocket.subscribe((state) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    });

    return unsubscribe;
  }, []);

  return (
    <ExampleBlock
      badge="04"
      title="Persisted settings"
      useCase="Site preferences"
      summary="This demo is isolated. These controls affect only this preview and persist after refresh."
      steps={PERSIST_STEPS}
    >
      <div
        className={[
          "settings-demo",
          `settings-theme-${theme}`,
          compact ? "is-compact" : "",
          reducedMotion ? "is-reduced-motion" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="settings-demo-bar">
          <div className="settings-demo-brand">
            <img alt="OtterPocket logo" className="site-preview-face" src={otterImage} />
            <span>Preview</span>
          </div>
          <button type="button">{theme === "kelp" ? "Kelp" : "River"}</button>
        </div>
        <div className="setting-line">
          <span>Theme</span>
          <div className="segmented">
            <button
              className={theme === "river" ? "active" : ""}
              onClick={() => settingsPocket.set("theme", "river")}
              type="button"
            >
              River
            </button>
            <button
              className={theme === "kelp" ? "active" : ""}
              onClick={() => settingsPocket.set("theme", "kelp")}
              type="button"
            >
              Kelp
            </button>
          </div>
        </div>
        <div className="setting-line">
          <span>Compact</span>
          <button onClick={() => settingsPocket.toggle("compact")} type="button">
            {compact ? "On" : "Off"}
          </button>
        </div>
        <div className="setting-line">
          <span>Motion</span>
          <button onClick={() => settingsPocket.toggle("reducedMotion")} type="button">
            {reducedMotion ? "Off" : "Full"}
          </button>
        </div>
        <div className="settings-demo-panels">
          <div className="settings-demo-panel">Button style</div>
          <div className="settings-demo-panel">Card spacing</div>
          <div className="settings-demo-panel motion-panel">
            <span className="motion-dot" />
            Motion preview
          </div>
        </div>
      </div>
    </ExampleBlock>
  );
}

export default DemoPersisted;
