import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ErrorBoundary';

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
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="luxury" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-dark min-h-screen text-white relative overflow-x-hidden`}>
        {/* Animated background gradients */}
        <div className="fixed inset-0 bg-dark-secondary/50" />
        <div className="fixed inset-0 bg-gradient-luxury opacity-10 animate-gradient" />
        <div className="fixed -inset-[100%] animate-[spin_60s_linear_infinite] opacity-20">
          <div className="absolute inset-0 bg-gradient-radial from-luxury-gold/20 via-transparent to-transparent blur-3xl" />
        </div>
        
        {/* Glass morphism overlay */}
        <div className="fixed inset-0 backdrop-blur-[100px]" />
        
        {/* Content */}
        <div className="relative isolate">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
