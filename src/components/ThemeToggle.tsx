'use client';

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 left-4 p-3 bg-dark-secondary/80 backdrop-blur-sm border border-luxury-gold/20 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:border-luxury-gold/40 group"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <SunIcon className="w-6 h-6 text-luxury-gold/70 group-hover:text-luxury-gold" />
      ) : (
        <MoonIcon className="w-6 h-6 text-luxury-gold/70 group-hover:text-luxury-gold" />
      )}
    </button>
  );
}