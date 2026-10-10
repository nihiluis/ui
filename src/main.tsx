import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./system";
import App from "./studio/App";
import "./system/styles.css";
import "./studio/studio.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
