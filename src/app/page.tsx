'use client';

import { useState } from 'react';
import { ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [script, setScript] = useState<any>(null);
  const [error, setError] = useState('');

  const generateScript = async () => {
    try {
      setError('');
      setIsGenerating(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      const data = await response.json();
      setScript(data.script);
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const enhanceScript = async () => {
    if (!script?.id) return;
    try {
      setIsEnhancing(true);
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId: script.id }),
      });
      const data = await response.json();
      setScript(data.script);
    } catch (error) {
      console.error('Error enhancing script:', error);
      alert('Failed to enhance script. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">KnightyTube Script Generator</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Video Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your video topic..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reference YouTube Video (Optional)</label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Paste YouTube URL to use as reference..."
            />
          </div>

          <button
            onClick={generateScript}
            disabled={!topic || isGenerating}
            className="w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Generating Script...
              </>
            ) : (
              'Generate Script'
            )}
          </button>
        </div>

        {script && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">{script.title}</h2>
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {script.enhancedScript || script.content}
              </pre>
            </div>

            {!script.enhancedScript && (
              <button
                onClick={enhanceScript}
                disabled={isEnhancing}
                className="w-full bg-purple-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 disabled:opacity-50"
              >
                {isEnhancing ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    Enhancing Script...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Enhance Script
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
