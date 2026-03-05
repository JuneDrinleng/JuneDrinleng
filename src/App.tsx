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
  // Dismiss the loading overlay once the app has rendered AND all images loaded
  useEffect(() => {
    if (!window.__siteArrivalOverlay) return;
    window.__siteArrivalOverlay = false;

    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      observer?.disconnect();
      const overlay = document.getElementById("site-arrival-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.addEventListener("transitionend", () => overlay.remove(), {
          once: true,
        });
      }
    };

    const checkImages = () => {
      const root = document.getElementById("root");
      if (!root) return;
      const images = Array.from(root.querySelectorAll<HTMLImageElement>("img"));
      // Need at least 1 image (profile) to be in the DOM
      if (images.length === 0) return;
      const pending = images.filter((img) => !img.complete);
      if (pending.length === 0) {
        dismiss();
        return;
      }
      // Listen for remaining images
      let remaining = pending.length;
      const onDone = () => {
        remaining--;
        if (remaining <= 0) dismiss();
      };
      pending.forEach((img) => {
        img.addEventListener("load", onDone, { once: true });
        img.addEventListener("error", onDone, { once: true });
      });
    };

    // Use MutationObserver to wait for images to appear in the DOM
    const observer = new MutationObserver(() => {
      const root = document.getElementById("root");
      if (root && root.querySelectorAll("img").length > 0) {
        observer.disconnect();
        checkImages();
      }
    });

    observer.observe(document.getElementById("root")!, {
      childList: true,
      subtree: true,
    });

    // Also check immediately in case images are already in the DOM
    checkImages();

    // Safety timeout: dismiss after 6s no matter what
    const safety = setTimeout(dismiss, 6000);
    return () => {
      clearTimeout(safety);
      observer.disconnect();
    };
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
