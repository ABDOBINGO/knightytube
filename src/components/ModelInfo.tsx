'use client';

import { SparklesIcon, BeakerIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const models = [
  {
    name: 'Gemini Pro',
    id: 'google/gemini-2.0-pro-exp-02-05:free',
    description: 'Primary script generation model with advanced storytelling capabilities',
    features: ['Structured Content', 'Natural Language', 'SEO Optimization'],
    icon: BeakerIcon,
  },
  {
    name: 'Deepseek',
    id: 'deepseek/deepseek-r1:free',
    description: 'Script enhancement model specializing in engagement and flow',
    features: ['Engagement Hooks', 'Style Refinement', 'Tone Adjustment'],
    icon: SparklesIcon,
  },
  {
    name: 'Qwen',
    id: 'qwen/qwen-72b:free',
    description: 'Available as fallback for additional creativity',
    features: ['Creative Ideas', 'Alternative Angles', 'Content Variety'],
    icon: LightBulbIcon,
  },
];

export default function ModelInfo({ activeModel }: { activeModel: string }) {
  return (
    <div className="glass-morphism rounded-xl overflow-hidden">
      <div className="p-4 border-b border-luxury-gold/10">
        <h3 className="text-lg font-medium text-luxury-gold">Available AI Models</h3>
      </div>
      <div className="divide-y divide-luxury-gold/10">
        {models.map((model) => {
          const Icon = model.icon;
          const isActive = activeModel === model.id;
          return (
            <div
              key={model.id}
              className={`p-4 transition-all duration-300 hover:bg-luxury-gold/5 ${
                isActive ? 'bg-luxury-gold/10' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`w-5 h-5 mt-1 transition-colors ${
                    isActive ? 'text-luxury-gold' : 'text-gray-400'
                  }`}
                />
                <div className="space-y-2">
                  <h4 className={`font-medium transition-colors ${
                    isActive ? 'text-luxury-gold' : 'text-gray-300'
                  }`}>
                    {model.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {model.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {model.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className={`text-xs px-2 py-1 rounded-full border ${
                          isActive 
                            ? 'border-luxury-gold/20 text-luxury-gold bg-luxury-gold/5' 
                            : 'border-gray-500/20 text-gray-400 bg-dark/20'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 bg-dark/30 border-t border-luxury-gold/10">
        <p className="text-xs text-gray-400 text-center">
          All models provided via OpenRouter API
        </p>
      </div>
    </div>
  );
}