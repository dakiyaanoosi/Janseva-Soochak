import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BusinessProvider } from "./contexts/BusinessContext";

createRoot(document.getElementById("root")!).render(
  <BusinessProvider>
    <App />
  </BusinessProvider>
);
