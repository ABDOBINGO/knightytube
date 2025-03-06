'use client';

import { useState } from 'react';
import { ArrowPathIcon, SparklesIcon, BeakerIcon, DocumentTextIcon, VideoCameraIcon, ClipboardIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import type { Script } from '@/types';
import AIStatus from '@/components/AIStatus';
import ModelInfo from '@/components/ModelInfo';
import LoadingDots from '@/components/LoadingDots';
import ScriptSkeleton from '@/components/ScriptSkeleton';
import Toast from '@/components/Toast';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [script, setScript] = useState<Script | null>(null);
  const [error, setError] = useState('');
  const [agentStatus, setAgentStatus] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const updateStatus = (message: string) => {
    setAgentStatus(prev => [...prev, message]);
  };

  const generateScript = async () => {
    try {
      setError('');
      setAgentStatus([]);
      setIsGenerating(true);
      setCurrentModel('google/gemini-2.0-pro-exp-02-05:free');
      updateStatus('🤖 Initializing Gemini Pro AI Model...');
      
      if (youtubeUrl) {
        updateStatus('🎥 Analyzing reference YouTube video for content and style...');
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, youtubeUrl }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate script');
      }
      
      updateStatus('✨ Crafting your script with advanced AI techniques...');
      updateStatus('📝 Structuring content and adding engagement hooks...');
      const data = await response.json();
      updateStatus('✅ Script generation complete!');
      setScript(data.script);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      updateStatus('❌ Error encountered during script generation');
      console.error('Error generating script:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const enhanceScript = async () => {
    if (!script?.id) return;
    try {
      setError('');
      setAgentStatus([]);
      setIsEnhancing(true);
      setCurrentModel('deepseek/deepseek-r1:free');
      updateStatus('🌟 Initializing Deepseek AI for enhancement...');
      updateStatus('🔍 Analyzing current script structure and content...');
      
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId: script.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enhance script');
      }

      updateStatus('🎯 Applying advanced writing techniques and improvements...');
      updateStatus('💫 Enhancing engagement factors and flow...');
      const data = await response.json();
      updateStatus('✨ Enhancement complete!');
      setScript(data.script);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      updateStatus('❌ Error during enhancement process');
      console.error('Error enhancing script:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!script) return;
    try {
      await navigator.clipboard.writeText(script.enhancedScript || script.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy script:', err);
    }
  };

  return (
    <main className="min-h-screen p-3 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="text-center space-y-3 md:space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair bg-gradient-luxury text-transparent bg-clip-text animate-gradient">
            KnightyTube
          </h1>
          <p className="text-lg md:text-xl text-gray-300">Create Captivating YouTube Scripts with AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Input Form */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="space-y-4 md:space-y-6 bg-dark-secondary/50 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-luxury-gold/20 shadow-xl">
              <div>
                <label className="flex items-center gap-2 text-lg font-medium text-gray-200 mb-2">
                  <DocumentTextIcon className="w-5 h-5 text-luxury-gold" />
                  Video Topic *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3 md:p-4 bg-dark border border-luxury-gold/20 rounded-xl focus:ring-2 focus:ring-luxury-gold/50 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your video topic..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-medium text-gray-200 mb-2">
                  <VideoCameraIcon className="w-5 h-5 text-luxury-gold" />
                  Reference YouTube Video
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full p-3 md:p-4 bg-dark border border-luxury-gold/20 rounded-xl focus:ring-2 focus:ring-luxury-gold/50 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Paste YouTube URL to use as reference..."
                />
                <p className="mt-2 text-sm text-gray-400">Optional: Add a video URL to base your script on its content</p>
              </div>

              {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={generateScript}
                disabled={!topic || isGenerating}
                className="w-full bg-gradient-luxury p-3 md:p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white shadow-lg transition-all duration-200 hover:shadow-luxury-gold/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    Crafting Your Script
                    <LoadingDots />
                  </>
                ) : (
                  <>
                    <BeakerIcon className="w-5 h-5" />
                    Generate Script
                  </>
                )}
              </button>
            </div>

            {isGenerating ? (
              <ScriptSkeleton />
            ) : script && (
              <div className="space-y-4 md:space-y-6 bg-dark-secondary/50 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-luxury-gold/20 shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl md:text-2xl font-playfair font-semibold text-luxury-gold">{script.title}</h2>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-luxury-gold/5 rounded-lg transition-colors"
                    title="Copy script to clipboard"
                  >
                    {isCopied ? (
                      <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-400" />
                    ) : (
                      <ClipboardIcon className="w-5 h-5 text-luxury-gold/70 hover:text-luxury-gold" />
                    )}
                  </button>
                </div>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-base md:text-lg leading-relaxed bg-dark/50 p-4 md:p-6 rounded-xl">
                    {script.enhancedScript || script.content}
                  </pre>
                </div>

                {!script.enhancedScript && (
                  <button
                    onClick={enhanceScript}
                    disabled={isEnhancing}
                    className="w-full bg-gradient-to-r from-luxury-purple to-luxury-gold p-3 md:p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white shadow-lg transition-all duration-200 hover:shadow-luxury-purple/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isEnhancing ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        Enhancing Your Script
                        <LoadingDots />
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        Enhance with Deepseek AI
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar with AI Status and Model Info */}
          <div className="space-y-4 md:space-y-6 lg:sticky lg:top-8">
            <ModelInfo activeModel={currentModel} />
            {agentStatus.length > 0 && (
              <AIStatus messages={agentStatus} currentModel={currentModel} />
            )}
          </div>
        </div>
      </div>
      <Toast message="Script copied to clipboard!" isVisible={isCopied} />
    </main>
  );
}
