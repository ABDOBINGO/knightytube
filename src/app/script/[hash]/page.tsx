'use client';

import { useEffect, useState } from 'react';
import { ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Script } from '@/types';
import Link from 'next/link';
import ErrorMessage from '@/components/ErrorMessage';
import ScriptSkeleton from '@/components/ScriptSkeleton';
import ResearchSources from '@/components/ResearchSources';
import Toast from '@/components/Toast';

export default function ScriptPage({
  params,
}: {
  params: { hash: string };
}) {
  const [script, setScript] = useState<Script | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const response = await fetch(`/api/scripts/${params.hash}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to load script');
        }
        const { script } = await response.json();
        
        // Parse searchQueries from JSON string if it exists
        if (script.researchData?.searchQueries) {
          script.researchData.searchQueries = JSON.parse(script.researchData.searchQueries);
        }
        
        setScript(script);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load script');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScript();
  }, [params.hash]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsToastVisible(true);
      setTimeout(() => setIsToastVisible(false), 2000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen p-3 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <ScriptSkeleton />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-3 md:p-8">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage message={error} />
          <Link 
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-luxury-gold hover:text-luxury-gold/80 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Return to Generator
          </Link>
        </div>
      </main>
    );
  }

  if (!script) return null;

  return (
    <main className="min-h-screen p-3 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-luxury-gold hover:text-luxury-gold/80 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Return to Generator
          </Link>
          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-luxury-gold hover:text-luxury-gold/80 transition-colors"
          >
            <ShareIcon className="w-4 h-4" />
            Share
          </button>
        </div>

        <div className="space-y-4 md:space-y-6 bg-dark-secondary/50 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-luxury-gold/20 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-playfair font-semibold text-luxury-gold">
            {script.title}
          </h1>
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-base md:text-lg leading-relaxed bg-dark/50 p-4 md:p-6 rounded-xl">
              {script.enhancedScript || script.content}
            </pre>
          </div>
        </div>

        {script.researchData && (
          <ResearchSources 
            sources={script.researchData.sources}
            searchQueries={script.researchData.searchQueries}
          />
        )}
      </div>
      <Toast message="Share link copied to clipboard!" isVisible={isToastVisible} />
    </main>
  );
}