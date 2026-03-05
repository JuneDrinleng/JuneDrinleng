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
  // Dismiss the loading overlay once ALL critical images have loaded.
  // Uses new Image() to preload — fully decoupled from React render timing.
  useEffect(() => {
    if (!window.__siteArrivalOverlay) return;
    window.__siteArrivalOverlay = false;

    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      const overlay = document.getElementById("site-arrival-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.addEventListener("transitionend", () => overlay.remove(), {
          once: true,
        });
      }
    };

    // All images that appear on the page
    const criticalImages = [
      "/assets/profile.jpg",
      "/assets/img/cell-rep-phys-sci-2025.jpg",
      "/assets/img/pnas-2025.png",
      "/assets/img/acs-appl-bio-mater-2025.jpeg",
      "/assets/img/beian_logo.png",
    ];

    let remaining = criticalImages.length;
    const onDone = () => {
      remaining--;
      if (remaining <= 0) dismiss();
    };

    criticalImages.forEach((src) => {
      const img = new Image();
      img.onload = onDone;
      img.onerror = onDone;
      img.src = src;
    });

    // Safety timeout: dismiss after 6s no matter what
    const safety = setTimeout(dismiss, 6000);
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
