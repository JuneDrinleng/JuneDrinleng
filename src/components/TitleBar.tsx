import { Moon, Sun, Github, Globe } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export function TitleBar() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary border-b-4 border-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-background">
            June Drinleng
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 hover:opacity-80 transition-all duration-200 flex items-center gap-2 text-background"
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
            className="p-2 hover:opacity-80 transition-all duration-200 text-background"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/JuneDrinleng"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:opacity-80 transition-all duration-200 text-background"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}
