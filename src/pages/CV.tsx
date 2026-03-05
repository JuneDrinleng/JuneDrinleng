import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useLanguage } from "../contexts/LanguageContext";
import "katex/dist/katex.min.css";

interface MarkdownData {
  file: string;
  content: string;
  title: string;
}

interface Publication {
  title: string;
  authors: string;
  citation: string;
  image: string;
  imageAlt: string;
}

/** Parse a structured publication markdown into card data */
function parsePublications(content: string): {
  heading: string;
  pubs: Publication[];
} {
  const headingMatch = content.match(/^# (.+)$/m);
  const heading = headingMatch ? headingMatch[1] : "Publications";

  // Split by --- separator, filter out empty / heading-only blocks
  const blocks = content
    .split(/^---$/m)
    .map((b) => b.trim())
    .filter((b) => b && !b.match(/^# /));

  const pubs: Publication[] = [];

  for (const block of blocks) {
    const titleMatch = block.match(/\*\*(.+?)\*\*/);
    const imageMatch = block.match(/!\[(.+?)\]\((.+?)\)/);
    const citationMatch = block.match(/_(.+?)_\s*(.+)/);

    // Authors: lines that are not title, image, citation, or empty
    const lines = block.split("\n").filter((l) => l.trim());
    const authorLine = lines.find(
      (l) =>
        !l.startsWith("**") &&
        !l.startsWith("!") &&
        !l.startsWith("_") &&
        !l.startsWith("#"),
    );

    if (titleMatch) {
      pubs.push({
        title: titleMatch[1],
        authors: authorLine?.trim() ?? "",
        citation: citationMatch
          ? `${citationMatch[1]} ${citationMatch[2]}`
          : "",
        image: imageMatch?.[2] ?? "",
        imageAlt: imageMatch?.[1] ?? "",
      });
    }
  }

  return { heading, pubs };
}

function PublicationCards({ content }: { content: string }) {
  const { heading, pubs } = parsePublications(content);

  return (
    <div>
      <h2 className="text-2xl font-bold mt-0 mb-6 border-b-2 border-foreground pb-3">
        {heading}
      </h2>
      <div className="space-y-6">
        {pubs.map((pub, i) => (
          <div
            key={i}
            className="pub-card flex flex-col sm:flex-row border-2 border-foreground/20 rounded-xl overflow-hidden hover:border-foreground/40 transition-colors duration-200 bg-secondary/30"
          >
            {/* Image – left side */}
            {pub.image && (
              <div className="sm:w-64 md:w-72 shrink-0 bg-muted/40 flex items-center justify-center p-4">
                <img
                  src={pub.image}
                  alt={pub.imageAlt}
                  className="w-full h-auto max-h-48 object-contain rounded-lg"
                />
              </div>
            )}
            {/* Text – right side */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center gap-2">
              <h3 className="text-lg font-bold leading-snug">{pub.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {pub.authors}
              </p>
              <p className="text-xs text-foreground/50 italic leading-relaxed mt-1">
                {pub.citation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CV() {
  const { language } = useLanguage();
  const [markdownData, setMarkdownData] = useState<MarkdownData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const files =
          language === "en"
            ? ["education.md", "research.md", "publication.md"]
            : ["education-zh.md", "research-zh.md", "publication-zh.md"];

        const data: MarkdownData[] = [];

        for (const file of files) {
          try {
            const response = await fetch(`/assets/${file}`);
            if (response.ok) {
              const content = await response.text();
              const titleMatch = content.match(/^# (.+)$/m);
              const title = titleMatch
                ? titleMatch[1]
                : file.replace(".md", "");
              data.push({ file, content, title });
            }
          } catch (error) {
            console.error(`Failed to load ${file}:`, error);
          }
        }

        setMarkdownData(data);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [language]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-lg">
          {language === "en" ? "Loading..." : "加载中..."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold mb-12 border-b-4 border-foreground pb-6">
        {language === "en" ? "Curriculum Vitae" : "个人简历"}
      </h1>

      <div className="space-y-12">
        {markdownData.map((section, index) => {
          const isPublication = section.file.includes("publication");

          if (isPublication) {
            return (
              <div key={index} className="markdown-content">
                <PublicationCards content={section.content} />
              </div>
            );
          }

          return (
            <div
              key={index}
              className="markdown-content prose dark:prose-invert max-w-none"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({ children }) => (
                    <h2 className="text-2xl font-bold mt-0 mb-6 border-b-2 border-foreground pb-3">
                      {children}
                    </h2>
                  ),
                  h2: ({ children }) => (
                    <h3 className="text-xl font-bold mt-6 mb-4">{children}</h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="text-lg font-bold mt-4 mb-3">{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="my-3 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-4 space-y-2 pl-6 list-disc">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => <li className="my-1">{children}</li>,
                  img: ({ alt, src, ...props }) => (
                    <div className="my-6">
                      <img
                        src={src}
                        alt={alt}
                        {...props}
                        className="max-w-full h-auto rounded-lg border-2 border-foreground"
                      />
                    </div>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-80"
                    >
                      {children}
                    </a>
                  ),
                  code: ({ className, children }) =>
                    className ? (
                      <code className="block bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm">
                        {children}
                      </code>
                    ) : (
                      <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                        {children}
                      </code>
                    ),
                }}
              >
                {section.content}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>
    </div>
  );
}
