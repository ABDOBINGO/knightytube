'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center space-y-4 p-6 bg-dark-secondary/30 backdrop-blur-sm rounded-xl border border-red-500/20">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-500/60 mx-auto" />
            <h2 className="text-xl font-medium text-red-400">Something went wrong</h2>
            <p className="text-gray-400 text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-dark border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}