import { pocket } from "../../store/pockets.js";

function TopBar({ otterImage }) {
  const darkMode = pocket.use("darkMode");

  return (
    <header className="topbar">
      <div className="wordmark">
        <img alt="OtterPocket logo" className="logo-face" src={otterImage} />
        <span>OtterPocket</span>
      </div>
      <nav className="topnav">
        <a href="#examples">Examples</a>
        <a href="#api">API</a>
        <button
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="nav-theme-toggle"
          onClick={() => pocket.toggle("darkMode")}
          type="button"
        >
          {darkMode ? "☀" : "☾"}
        </button>
      </nav>
    </header>
  );
}

export default TopBar;
