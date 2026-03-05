import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";

import "./styles/index.css";

declare global {
  interface Window {
    __siteArrivalOverlay?: boolean;
  }
}

export function App() {
  // Dismiss the arrival overlay once the app has fully rendered
  useEffect(() => {
    if (!window.__siteArrivalOverlay) return;
    window.__siteArrivalOverlay = false;
    // Small delay so the first paint settles behind the overlay
    const timer = setTimeout(() => {
      const overlay = document.getElementById("site-arrival-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.addEventListener("transitionend", () => overlay.remove(), {
          once: true,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
