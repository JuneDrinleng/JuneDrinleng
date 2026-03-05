import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { ArrowRight } from "lucide-react";

export function Home() {
  const { language } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-12 md:gap-16">
        {/* Hero Section */}
        <div className="border-b-4 border-foreground pb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            {language === "en" ? "June Drinleng" : "元勻"}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-4 max-w-2xl">
            {language === "en"
              ? "PhD Candidate in Chemistry at Tsinghua University"
              : "清华大学化学系博士候选人"}
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {language === "en"
              ? "Focused on deep learning, single-particle tracking, and trajectory analysis."
              : "专注于深度学习、单颗粒示踪和轨迹分析。"}
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/cv"
            className="group border-4 border-foreground p-8 hover:bg-muted transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {language === "en" ? "View CV" : "查看简历"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === "en"
                    ? "Education, research, publications"
                    : "教育、研究、发表"}
                </p>
              </div>
              <ArrowRight
                className="group-hover:translate-x-2 transition-transform"
                size={24}
              />
            </div>
          </Link>

          <a
            href="https://github.com/JuneDrinleng"
            target="_blank"
            rel="noopener noreferrer"
            className="group border-4 border-foreground p-8 hover:bg-muted transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {language === "en" ? "GitHub" : "GitHub"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === "en" ? "Code and projects" : "代码和项目"}
                </p>
              </div>
              <ArrowRight
                className="group-hover:translate-x-2 transition-transform"
                size={24}
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
