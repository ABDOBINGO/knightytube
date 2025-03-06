import { BeakerIcon } from '@heroicons/react/24/outline';

interface ResearchStatusProps {
  isActive: boolean;
  sources: number;
  queries: string[];
}

export default function ResearchStatus({ isActive, sources, queries }: ResearchStatusProps) {
  if (!isActive && !sources && !queries.length) return null;

  return (
    <div className="rounded-xl bg-dark/50 border border-luxury-gold/10 p-4">
      <div className="flex items-center gap-2 text-luxury-gold mb-3">
        <BeakerIcon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
        <h3 className="font-medium">Research Progress</h3>
      </div>

      <div className="space-y-2 text-sm">
        {isActive ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-luxury-gold/20 animate-pulse" />
            <span className="text-gray-300">Researching topic...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500/20" />
            <span className="text-gray-300">Research complete</span>
          </div>
        )}

        <div className="pl-6 space-y-1">
          <p className="text-gray-400">
            Sources found: <span className="text-luxury-gold">{sources}</span>
          </p>
          <p className="text-gray-400">
            Queries executed: <span className="text-luxury-gold">{queries.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}