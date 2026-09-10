import type { Metadata } from 'next';
import './globals.css';
import { WebsiteChatbot } from '@/components/website-chatbot';

export const metadata: Metadata = {
  title: {
    default: 'Kalpra Academy | Future-Ready Skills. Real Possibilities.',
    template: '%s | Kalpra Academy',
  },
  description:
    'Explore Python, data science, AI, cloud and career programs at Kalpra Academy. Learn with expert mentors, practical projects and career guidance.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ),
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
      <body className="antialiased">
        {children}
        <WebsiteChatbot />
      </body>
    </html>
  );
}
