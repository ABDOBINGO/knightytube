import { ResearchResult } from '@/types';
import { LinkIcon, BeakerIcon } from '@heroicons/react/24/outline';

interface ResearchSourcesProps {
  sources?: ResearchResult[];
  searchQueries?: string[];
}

export default function ResearchSources({ sources, searchQueries }: ResearchSourcesProps) {
  if (!sources?.length && !searchQueries?.length) return null;

  return (
    <div className="mt-6 space-y-4 bg-dark/30 p-4 rounded-xl border border-luxury-gold/10">
      <div className="flex items-center gap-2 text-luxury-gold">
        <BeakerIcon className="w-5 h-5" />
        <h3 className="text-lg font-medium">Research Sources</h3>
      </div>

      {searchQueries && searchQueries.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Search Queries Used:</h4>
          <div className="flex flex-wrap gap-2">
            {searchQueries.map((query, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-dark/50 rounded-full border border-luxury-gold/10 text-gray-300"
              >
                {query}
              </span>
            ))}
          </div>
        </div>
      )}

      {sources && sources.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-400">Referenced Sources:</h4>
          <div className="space-y-3">
            {sources.map((source, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-luxury-gold/70">{source.source}</span>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-luxury-gold hover:text-luxury-gold/80 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {source.title}
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {source.snippet}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}