'use client';

import { FormEvent, useState } from 'react';
import { ArrowPathIcon, SparklesIcon, BeakerIcon, DocumentTextIcon, VideoCameraIcon, ClipboardIcon, ClipboardDocumentCheckIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import type { Script } from '@/types';
import AIStatus from '@/components/AIStatus';
import ModelInfo from '@/components/ModelInfo';
import LoadingDots from '@/components/LoadingDots';
import ScriptSkeleton from '@/components/ScriptSkeleton';
import Toast from '@/components/Toast';
import ErrorMessage from '@/components/ErrorMessage';
import { useFormInput } from '@/hooks/useFormInput';
import { validateTopic, validateYoutubeUrl } from '@/utils/validation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import ResearchSources from '@/components/ResearchSources';

export default function Home() {
  const topicInput = useFormInput({
    validate: validateTopic,
    autoFocus: true,
  });
  const youtubeUrlInput = useFormInput({
    validate: validateYoutubeUrl,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [script, setScript] = useState<Script | null>(null);
  const [error, setError] = useState('');
  const [agentStatus, setAgentStatus] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isShareToastVisible, setIsShareToastVisible] = useState(false);

  const router = useRouter();

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

      // Create EventSource for server-sent events
      const eventSource = new EventSource(`/api/generate?topic=${encodeURIComponent(topicInput.value)}&youtubeUrl=${encodeURIComponent(youtubeUrlInput.value || '')}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status) {
          updateStatus(data.status);
        } else if (data.script) {
          setScript(data.script);
          eventSource.close();
          setIsGenerating(false);
        } else if (data.error) {
          throw new Error(data.error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        eventSource.close();
        setIsGenerating(false);
        setError('Failed to generate script. Please try again.');
      };
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      updateStatus('❌ Error encountered during script generation');
      console.error('Error generating script:', error);
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

  const shareScript = async () => {
    if (!script?.hash) return;
    
    try {
      const shareUrl = `${window.location.origin}/script/${script.hash}`;
      await navigator.clipboard.writeText(shareUrl);
      setIsShareToastVisible(true);
      setTimeout(() => setIsShareToastVisible(false), 2000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const viewScript = () => {
    if (!script?.hash) return;
    router.push(`/script/${script.hash}`);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const topicError = validateTopic(topicInput.value);
    const urlError = validateYoutubeUrl(youtubeUrlInput.value);

    if (topicError) {
      setError(topicError);
      return;
    }

    if (urlError) {
      setError(urlError);
      return;
    }

    await generateScript();
  };

  useKeyboardShortcuts([
    {
      key: 'Enter',
      ctrlKey: true,
      handler: (e) => {
        if (!isGenerating && topicInput.value && !topicInput.error && !youtubeUrlInput.error) {
          e.preventDefault();
          generateScript();
        }
      },
      preventDefault: true,
    },
    {
      key: 'c',
      ctrlKey: true,
      altKey: true,
      handler: (e) => {
        if (script) {
          e.preventDefault();
          copyToClipboard();
        }
      },
      preventDefault: true,
    },
    {
      key: 'e',
      ctrlKey: true,
      handler: (e) => {
        if (script && !script.enhancedScript && !isEnhancing) {
          e.preventDefault();
          enhanceScript();
        }
      },
      preventDefault: true,
    },
  ]);

  // Track if we have unsaved changes
  const hasUnsavedChanges = Boolean(
    (topicInput.value || youtubeUrlInput.value) && !script
  );

  // Use the unsaved changes hook
  useUnsavedChanges(hasUnsavedChanges);

  return (
    <main className="min-h-screen p-3 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="text-center space-y-3 md:space-y-4"></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair bg-gradient-luxury text-transparent bg-clip-text animate-gradient">
            KnightyTube
          </h1>
          <p className="text-lg md:text-xl text-gray-300">Create Captivating YouTube Scripts with AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Input Form */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 bg-dark-secondary/50 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-luxury-gold/20 shadow-xl">
              <div>
                <label className="flex items-center gap-2 text-lg font-medium text-gray-200 mb-2">
                  <DocumentTextIcon className="w-5 h-5 text-luxury-gold" />
                  Video Topic *
                </label>
                <input
                  {...topicInput.inputProps}
                  type="text"
                  className="w-full p-3 md:p-4 bg-dark border border-luxury-gold/20 rounded-xl focus:ring-2 focus:ring-luxury-gold/50 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your video topic..."
                />
                {topicInput.error && <ErrorMessage message={topicInput.error} className="mt-2" />}
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-medium text-gray-200 mb-2">
                  <VideoCameraIcon className="w-5 h-5 text-luxury-gold" />
                  Reference YouTube Video
                </label>
                <input
                  {...youtubeUrlInput.inputProps}
                  type="text"
                  className="w-full p-3 md:p-4 bg-dark border border-luxury-gold/20 rounded-xl focus:ring-2 focus:ring-luxury-gold/50 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Paste YouTube URL to use as reference..."
                />
                <p className="mt-2 text-sm text-gray-400">Optional: Add a video URL to base your script on its content</p>
                {youtubeUrlInput.error && <ErrorMessage message={youtubeUrlInput.error} className="mt-2" />}
              </div>

              {error && !topicInput.error && !youtubeUrlInput.error && (
                <ErrorMessage message={error} />
              )}

              <button
                type="submit"
                disabled={!topicInput.value || isGenerating || !!topicInput.error || !!youtubeUrlInput.error}
                className="w-full bg-gradient-luxury p-3 md:p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white shadow-lg transition-all duration-200 hover:shadow-luxury-gold/20 hover:scale-[1.02] active:scale-[0.98]"
                title="Generate script (Ctrl+Enter)"
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
            </form>

            {isGenerating ? (
              <ScriptSkeleton />
            ) : script && (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-dark-secondary/50 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-luxury-gold/20 shadow-xl">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl md:text-2xl font-playfair font-semibold text-luxury-gold">
                      {script.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={shareScript}
                        className="p-2 hover:bg-luxury-gold/5 rounded-lg transition-colors group relative"
                        title="Share script"
                      >
                        <ShareIcon className="w-5 h-5 text-luxury-gold/70 group-hover:text-luxury-gold" />
                        <span className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-dark-secondary/90 rounded whitespace-nowrap">
                          Share script
                        </span>
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-luxury-gold/5 rounded-lg transition-colors group relative"
                        title="Copy script to clipboard (Ctrl+Alt+C)"
                      >
                        {isCopied ? (
                          <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-400" />
                        ) : (
                          <ClipboardIcon className="w-5 h-5 text-luxury-gold/70 group-hover:text-luxury-gold" />
                        )}
                        <span className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-dark-secondary/90 rounded whitespace-nowrap">
                          Copy (Ctrl+Alt+C)
                        </span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-base md:text-lg leading-relaxed bg-dark/50 p-4 md:p-6 rounded-xl mt-4">
                      {script.enhancedScript || script.content}
                    </pre>
                  </div>

                  {!script.enhancedScript && (
                    <button
                      onClick={enhanceScript}
                      disabled={isEnhancing}
                      className="w-full mt-6 bg-gradient-to-r from-luxury-purple to-luxury-gold p-3 md:p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-white shadow-lg transition-all duration-200 hover:shadow-luxury-purple/20 hover:scale-[1.02] active:scale-[0.98]"
                      title="Enhance script (Ctrl+E)"
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

                {script.researchData && (
                  <ResearchSources 
                    sources={script.researchData.sources}
                    searchQueries={
                      typeof script.researchData.searchQueries === 'string' 
                        ? JSON.parse(script.researchData.searchQueries)
                        : script.researchData.searchQueries
                    }
                  />
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
      <Toast message="Share link copied!" isVisible={isShareToastVisible} />
    </main>
  );
}
