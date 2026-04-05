import CopyButton from "../common/CopyButton.jsx";
import { HERO_SNIPPET } from "../../data/siteContent.js";

function Hero({ otterImage }) {
  return (
    <section className="hero section section-anchor">
      <div className="hero-copy">
        <span className="eyebrow">What OtterPocket is</span>
        <h1>A small React state library for app and UI state.</h1>
        <p className="hero-text">
          Use it to manage counters, todo lists, filters, dark mode, and saved settings
          without Redux-style boilerplate.
        </p>
        <div className="install-card">
          <div className="install-line">
            <code>npm install otterpocket</code>
            <CopyButton text="npm install otterpocket" />
          </div>
        </div>
        <div className="hero-actions">
          <a className="primary-link" href="#examples">
            Explore examples
          </a>
          <a className="secondary-link" href="#api">
            View API
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-panel">
          <div className="hero-image-slot">
            <img alt="OtterPocket otter" className="hero-otter" src={otterImage} />
          </div>
          <div className="hero-points">
            <span>Counter, step by step</span>
            <span>Todo + filter, step by step</span>
            <span>Dark mode for the whole site</span>
          </div>
        </div>
        <div className="code-window">
          <div className="window-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="code-card-head code-window-head">
            <span>Starter example</span>
            <CopyButton className="snippet-copy" text={HERO_SNIPPET} />
          </div>
          <pre>
            <code>{HERO_SNIPPET}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

export default Hero;
