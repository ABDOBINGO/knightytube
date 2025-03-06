'use client';

import { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';
import ErrorBoundary from './ErrorBoundary';

interface ClientLayoutProps {
  children: ReactNode;
  interVariable: string;
  playfairVariable: string;
}

export default function ClientLayout({ children, interVariable, playfairVariable }: ClientLayoutProps) {
  return (
    <body className={`${interVariable} ${playfairVariable} font-sans bg-gradient-to-br from-white to-gray-100 dark:from-dark dark:to-dark-secondary min-h-screen text-gray-900 dark:text-white relative overflow-x-hidden transition-colors duration-300`}>
      {/* Animated background gradients */}
      <div className="fixed inset-0 bg-white/50 dark:bg-dark-secondary/50 transition-colors duration-300" />
      <div className="fixed inset-0 bg-gradient-luxury opacity-5 dark:opacity-10 animate-gradient" />
      <div className="fixed -inset-[100%] animate-[spin_60s_linear_infinite] opacity-10 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-radial from-luxury-gold/10 dark:from-luxury-gold/20 via-transparent to-transparent blur-3xl" />
      </div>
      
      {/* Glass morphism overlay */}
      <div className="fixed inset-0 backdrop-blur-[100px]" />
      
      {/* Content */}
      <div className="relative isolate">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </body>
  );
}