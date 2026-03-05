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
        </div>
      </footer>
    </div>
  );
}
