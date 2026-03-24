// Minimal root layout — the [locale]/layout.tsx handles <html>, <body>, providers.
// This file exists because Next.js requires app/layout.tsx, but it must NOT
// render <html> or <body> (that would duplicate the [locale] layout's elements).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
