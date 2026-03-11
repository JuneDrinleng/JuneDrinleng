import { Moon, Sun, Github, Globe, BookOpen } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import SiteTransition from "./SiteTransition";

const NAV_ITEMS = [
  { id: "about", en: "About", zh: "关于" },
  { id: "education", en: "Education", zh: "教育" },
  { id: "research", en: "Research", zh: "研究" },
  { id: "publications", en: "Publications", zh: "论文" },
];

export function TitleBar() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [transitioning, setTransitioning] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgb(3,2,19)] border-b-4 border-[rgb(3,2,19)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            June Drinleng
          </h1>
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 rounded"
              >
                {language === "en" ? item.en : item.zh}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Blog / LUNE site link */}
          <button
            onClick={() => setTransitioning(true)}
            className="p-2 hover:opacity-80 transition-all duration-200 flex items-center gap-1.5 text-white"
            aria-label="Go to Blog"
            title="LUNE – Blog"
          >
            <BookOpen size={18} />
            <span className="text-xs font-semibold hidden sm:inline">
              {language === "zh" ? "博客" : "Blog"}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 hover:opacity-80 transition-all duration-200 flex items-center gap-2 text-white"
            aria-label="Toggle language"
          >
            <Globe size={20} />
            <span className="text-xs font-semibold hidden sm:inline">
              {language.toUpperCase()}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:opacity-80 transition-all duration-200 text-white"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/JuneDrinleng"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:opacity-80 transition-all duration-200 text-white"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </div>

      <SiteTransition
        targetUrl="https://junedrinleng.github.io"
        active={transitioning}
        theme={theme}
        onCancel={() => setTransitioning(false)}
      />
    </header>
  );
}
