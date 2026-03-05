import { TitleBar } from "./TitleBar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TitleBar />
      <main className="pt-20 pb-12">{children}</main>
      <footer className="bg-muted text-foreground border-t-4 border-foreground py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © 2024–2026 June Drinleng. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs mt-2 opacity-70 flex-wrap">
            <a
              href="https://beian.mps.gov.cn/#/query/webSearch?code=11010802046610"
              rel="noreferrer"
              target="_blank"
              className="hover:opacity-100 underline inline-flex items-center gap-1"
            >
              <img
                src="/assets/img/beian_logo.png"
                alt=""
                className="h-3.5 w-3.5"
              />
              京公网安备11010802046610号
            </a>
            <span>|</span>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-100 underline"
            >
              京ICP备2025124159号
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
