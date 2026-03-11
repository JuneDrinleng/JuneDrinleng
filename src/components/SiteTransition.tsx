import { useCallback, useEffect, useRef, useState } from "react";

interface SiteTransitionProps {
  targetUrl: string;
  active: boolean;
  theme?: "light" | "dark";
  onCancel?: () => void;
}

// Keyframes are injected as a <style> tag so the component is self-contained
// and requires no external CSS file changes.
const KEYFRAMES = `
@keyframes st-cover-in {
  from { clip-path: inset(0 0 100% 0); opacity: 0; }
  to   { clip-path: inset(0 0 0%   0); opacity: 1; }
}
@keyframes st-dot-pulse {
  0%, 100% { opacity: .25; transform: scale(.8);  }
  50%      { opacity: 1;   transform: scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .st-overlay-cover { animation: none !important; clip-path: none !important; opacity: 1 !important; }
  .st-dot-anim      { animation: none !important; opacity: .6 !important; }
}
`;

/**
 * Full-screen overlay that plays a wipe animation before navigating to
 * another site, preventing the jarring flash of a raw cross-origin page load.
 */
export default function SiteTransition({
  targetUrl,
  active,
  theme = "dark",
  onCancel,
}: SiteTransitionProps) {
  const [phase, setPhase] = useState<
    "idle" | "covering" | "loading" | "leaving"
  >("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      cleanup();
      return;
    }

    // Phase 1: overlay wipes in from top (animation: 380ms)
    setPhase("covering");

    // Phase 2: show loading indicator once overlay is fully in place
    timerRef.current = setTimeout(() => {
      setPhase("loading");

      // Phase 3: navigate away after a brief loading pulse
      timerRef.current = setTimeout(() => {
        setPhase("leaving");
        const sep = targetUrl.includes("?") ? "&" : "?";
        window.location.href = `${targetUrl}${sep}theme=${theme}`;
      }, 380);
    }, 400);

    return cleanup;
  }, [active, targetUrl, theme, cleanup]);

  if (phase === "idle") return null;

  const isDark = theme !== "light";
  const bg = isDark ? "#000" : "#fff";
  const dotColor = isDark ? "#fff" : "#000";
  const labelColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
  const showLoader = phase === "loading" || phase === "leaving";

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        className="st-overlay-cover"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          pointerEvents: "all",
          animation:
            phase === "covering"
              ? "st-cover-in 380ms cubic-bezier(0.4,0,0.2,1) both"
              : undefined,
          opacity: phase === "covering" ? undefined : 1,
        }}
        onClick={phase === "covering" ? onCancel : undefined}
        role="presentation"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            opacity: showLoader ? 1 : 0,
            transform: showLoader ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 300ms ease, transform 300ms ease",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 150, 300].map((delay, i) => (
              <span
                key={i}
                className="st-dot-anim"
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: dotColor,
                  animation: "st-dot-pulse 1s ease-in-out infinite",
                  animationDelay: `${delay}ms`,
                }}
              />
            ))}
          </div>
          <p
            style={{
              color: labelColor,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Redirecting…
          </p>
        </div>
      </div>
    </>
  );
}
