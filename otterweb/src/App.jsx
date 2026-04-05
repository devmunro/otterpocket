import otterImage from "./assets/otter.jpg";
import "./App.css";
import { pocket } from "./store/pockets.js";
import TopBar from "./components/sections/TopBar.jsx";
import Hero from "./components/sections/Hero.jsx";
import ExamplesSection from "./components/sections/ExamplesSection.jsx";
import ApiReference from "./components/sections/ApiReference.jsx";

function App() {
  const darkMode = pocket.use("darkMode");
  const shellClassName = ["site-shell", darkMode ? "site-dark" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClassName}>
      <TopBar otterImage={otterImage} />

      <main id="top">
        <Hero otterImage={otterImage} />
        <ExamplesSection otterImage={otterImage} />
        <ApiReference />
      </main>

      <footer className="site-footer">
        <a href="https://github.com/devmunro/otterpocket">GitHub</a>
        <a href="https://www.npmjs.com/package/otterpocket">npm</a>
        <a href="#api">Docs</a>
        <a href="#examples">Examples</a>
      </footer>
    </div>
  );
}

export default App;
