import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TagsProvider } from "./TagsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TagsProvider>
      <App />
    </TagsProvider>
  </StrictMode>
);
