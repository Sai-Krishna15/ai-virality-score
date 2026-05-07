import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Virality Score — Know Before You Post',
  description: 'AI-powered virality analysis for creators. Score your content on hook strength, visual appeal, caption quality, and hashtag relevance.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-[var(--font-inter)] relative z-10">{children}</body>
    </html>
  );
}
