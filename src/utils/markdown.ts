export interface MarkdownContent {
  content: string;
  title: string;
}

const markdownModules = import.meta.glob("../../../assets/*.md", {
  query: "?raw",
  import: "default",
});

const translations: Record<string, Record<string, string>> = {
  en: {
    Education: "Education",
    Research: "Research",
    Publications: "Publications",
    About: "About",
    CV: "CV",
    Home: "Home",
  },
  zh: {
    Education: "教育经历",
    Research: "研究方向",
    Publications: "发表论文",
    About: "关于我",
    CV: "个人简历",
    Home: "首页",
  },
};

export function t(key: string, lang: string): string {
  return translations[lang]?.[key] ?? key;
}

export async function loadMarkdown(
  filename: string,
): Promise<MarkdownContent | null> {
  try {
    const modulePath = `../../../assets/${filename}`;
    const module = markdownModules[modulePath];
    if (!module) return null;

    const content = (await module()) as string;
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename.replace(".md", "");

    return {
      content,
      title,
    };
  } catch (error) {
    console.error(`Failed to load ${filename}:`, error);
    return null;
  }
}

export async function loadAllMarkdown(): Promise<
  Record<string, MarkdownContent>
> {
  const files = [
    "education.md",
    "education-zh.md",
    "research.md",
    "research-zh.md",
    "publication.md",
    "publication-zh.md",
  ];
  const result: Record<string, MarkdownContent> = {};

  for (const file of files) {
    const data = await loadMarkdown(file);
    if (data) {
      result[file] = data;
    }
  }

  return result;
}
