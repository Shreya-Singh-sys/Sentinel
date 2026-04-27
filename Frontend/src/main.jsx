// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";

// createRoot(document.getElementById("root")).render(<App />);

import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Ye import karein
import App from "./App.jsx";
import { I18nProvider } from "./i18n/I18nProvider";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter> {/* 2. App ko iske andar wrap karein */}
        <App />
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>
);