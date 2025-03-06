'use client';

import { XCircleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`p-4 bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-xl ${className}`}>
      <div className="flex items-start gap-3">
        <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="text-sm text-red-400">{message}</p>
        </div>
      </div>
    </div>
  );
}