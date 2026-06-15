import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Day1TraderSimulator from "./Day1TraderSimulator.jsx";
import Landing from "./Landing.jsx";

// Hash router: "/" shows the landing page, "#play" launches the game.
// Keeps everything one SPA, deep-links and the browser back button work,
// and the published QR link lands on the page, not straight into the game.
function Root() {
  const [playing, setPlaying] = useState(() => window.location.hash === "#play");

  useEffect(() => {
    const sync = () => setPlaying(window.location.hash === "#play");
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // jump to top when switching views
  }, [playing]);

  if (playing) return <Day1TraderSimulator />;
  return <Landing onPlay={() => { window.location.hash = "play"; }} />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
