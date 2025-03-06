'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export default function Toast({ message, isVisible }: ToastProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 animate-fade-in">
      <div className="bg-dark-secondary/90 backdrop-blur-sm border border-luxury-gold/20 rounded-lg shadow-xl px-4 py-3 flex items-center gap-2">
        <CheckCircleIcon className="w-5 h-5 text-green-400" />
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
}