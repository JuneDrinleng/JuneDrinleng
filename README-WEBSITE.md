# June Drinleng - CV Website

A modern, responsive personal CV website built with React, TypeScript, and Tailwind CSS. Inspired by the brutalist design aesthetic of [junedrinleng.github.io](https://junedrinleng.github.io).

## Features

- **Dark/Light Theme**: Automatic theme switching with persistent storage
- **Multi-language Support**: English and Chinese language switching
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Markdown-based Content**: CV sections load from markdown files in `/assets`
- **Mathematical Formulas**: Support for KaTeX mathematical expressions
- **GitHub Flavored Markdown**: Tables, strikethrough, and more
- **Modern Stack**: React 18, TypeScript, Vite, Tailwind CSS 4

## Project Structure

```
junedrinleng/
├── assets/                    # Markdown content files
│   ├── education.md          # Education history (English)
│   ├── education-zh.md       # Education history (Chinese)
│   ├── research.md           # Research interests (English)
│   ├── research-zh.md        # Research interests (Chinese)
│   ├── publication.md        # Publications (English)
│   └── publication-zh.md     # Publications (Chinese)
├── src/
│   ├── components/           # React components
│   │   ├── TitleBar.tsx      # Navigation header
│   │   └── Layout.tsx        # Main layout wrapper
│   ├── contexts/             # Context providers
│   │   ├── ThemeContext.tsx  # Theme management
│   │   └── LanguageContext.tsx # Language management
│   ├── pages/                # Route pages
│   │   ├── Home.tsx          # Home page
│   │   └── CV.tsx            # CV page
│   ├── utils/                # Utility functions
│   │   └── markdown.ts       # Markdown loading utilities
│   ├── styles/               # Global styles
│   │   └── index.css         # Main stylesheet with Tailwind
│   ├── App.tsx               # Main app component
│   └── main.tsx              # React entry point
├── index.html                # HTML entry point
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── tailwind.config.ts        # Tailwind CSS configuration
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The website will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Customization

### Update Content

Edit the markdown files in the `/assets` directory:

- `education.md` / `education-zh.md`
- `research.md` / `research-zh.md`
- `publication.md` / `publication-zh.md`

### Styling

The design uses custom CSS variables defined in `src/styles/index.css`:

- Light mode: Clean white background with dark text
- Dark mode: Dark background with light text
- Tailwind CSS for responsive utilities

### Add New Pages

1. Create a new component in `src/pages/`
2. Add a route in `src/App.tsx`
3. Add navigation link in `src/components/TitleBar.tsx`

## Design Inspiration

This website follows the brutalist web design aesthetic of [junedrinleng.github.io](https://junedrinleng.github.io):

- Bold, clean typography
- High contrast colors (black/white)
- Thick borders and simple layouts
- Minimal animations
- Focus on content and readability

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS 4** - Utility-first CSS
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering
- **KaTeX** - Mathematical formula rendering
- **Lucide React** - Icon library

## License

© 2024–2026 June Drinleng. All rights reserved.

## Contributing

This is a personal CV website. For suggestions or improvements, please reach out via GitHub.

---

Built with ❤️ in 2025
