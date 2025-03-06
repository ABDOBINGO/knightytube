'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  public componentDidMount() {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global error:', { message, source, lineno, colno, error });
      if (error) {
        this.setState({
          hasError: true,
          error: error as Error,
        });
      }
    };

    window.onunhandledrejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.setState({
        hasError: true,
        error: event.reason as Error,
      });
    };
  }

  public componentWillUnmount() {
    window.onerror = null;
    window.onunhandledrejection = null;
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6 p-8 bg-dark-secondary/30 backdrop-blur-sm rounded-xl border border-red-500/20">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500/60 mx-auto" />
            <div className="space-y-3">
              <h2 className="text-2xl font-medium text-red-400">Something Went Wrong</h2>
              <p className="text-gray-400">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full px-4 py-2 bg-dark border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full px-4 py-2 bg-dark border border-luxury-gold/20 rounded-lg text-luxury-gold hover:bg-luxury-gold/10 transition-colors"
              >
                Return to Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <div className="mt-4 text-left">
                <details className="text-sm text-gray-400">
                  <summary className="cursor-pointer hover:text-gray-300">Error Details</summary>
                  <pre className="mt-2 p-4 bg-dark rounded-lg overflow-auto text-xs">
                    {this.state.error?.stack}
                    {'\n\nComponent Stack:\n'}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}