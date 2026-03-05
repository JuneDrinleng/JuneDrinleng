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
  // Dismiss the loading overlay once the app has rendered AND images have loaded
  useEffect(() => {
    if (!window.__siteArrivalOverlay) return;
    window.__siteArrivalOverlay = false;

    const dismiss = () => {
      const overlay = document.getElementById("site-arrival-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.addEventListener("transitionend", () => overlay.remove(), {
          once: true,
        });
      }
    };

    // Wait for all <img> in #root to finish loading
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>("#root img"),
    );
    const pending = images.filter((img) => !img.complete);

    if (pending.length === 0) {
      // All images already loaded (cached or none)
      const t = setTimeout(dismiss, 50);
      return () => clearTimeout(t);
    }

    let remaining = pending.length;
    const onDone = () => {
      remaining--;
      if (remaining <= 0) dismiss();
    };
    pending.forEach((img) => {
      img.addEventListener("load", onDone, { once: true });
      img.addEventListener("error", onDone, { once: true });
    });

    // Safety timeout: dismiss after 4s no matter what
    const safety = setTimeout(dismiss, 4000);
    return () => clearTimeout(safety);
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
