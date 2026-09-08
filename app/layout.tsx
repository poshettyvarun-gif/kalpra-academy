import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Kalpra Academy | Future-Ready Skills. Real Possibilities.',
    template: '%s | Kalpra Academy',
  },
  description:
    'Explore Python, data science, AI, cloud and career programs at Kalpra Academy. Learn with expert mentors, practical projects and career guidance.',
  metadataBase: new URL('https://kalpra-academy.kalpra-vfx.chatgpt.site'),
  openGraph: {
    title: 'Kalpra Academy | Build Your Future',
    description:
      'Learn future-ready skills with expert mentors, real projects and career guidance.',
    type: 'website',
    siteName: 'Kalpra Academy',
  },
  icons: { icon: '/assets/kalpra-logo.png' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
