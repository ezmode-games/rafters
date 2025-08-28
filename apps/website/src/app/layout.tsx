import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const plexSans = IBM_Plex_Sans({
  variable: '--font-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: 'Rafters – AI-first design system',
  description: 'Install AI-first design system components with embedded intelligence',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${plexMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
