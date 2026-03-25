import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import App from "./App.jsx";

registerSW({
  immediate: true,
  onOfflineReady() {
    console.log("Application prete pour un usage hors ligne.");
  },
  onNeedRefresh() {
    console.log("Nouvelle version disponible.");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
