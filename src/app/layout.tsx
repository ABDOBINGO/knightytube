import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KnightyTube - Luxury AI Script Generator',
  description: 'Create captivating YouTube scripts using advanced AI models',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' }
  ],
  icons: {
    icon: '/favicon.ico'
  },
  openGraph: {
    title: 'KnightyTube - AI Script Generator',
    description: 'Create engaging YouTube scripts with advanced AI models',
    type: 'website',
    siteName: 'KnightyTube',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GlobalErrorBoundary>
        <ClientLayout 
          interVariable={inter.variable} 
          playfairVariable={playfair.variable}
        >
          {children}
        </ClientLayout>
      </GlobalErrorBoundary>
    </html>
  );
}
