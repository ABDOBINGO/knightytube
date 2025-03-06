'use client';

import { BeakerIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';

interface AIStatusProps {
  messages: string[];
  currentModel: string;
}

export default function AIStatus({ messages, currentModel }: AIStatusProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="glass-morphism rounded-xl overflow-hidden">
      <div className="p-4 border-b border-luxury-gold/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BeakerIcon className="w-5 h-5 text-luxury-gold" />
          <h3 className="text-lg font-medium text-luxury-gold">AI Agent Status</h3>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-luxury-gold/80 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-luxury-gold/60 animate-pulse delay-100"></div>
          <div className="w-2 h-2 rounded-full bg-luxury-gold/40 animate-pulse delay-200"></div>
        </div>
      </div>
      
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-2 text-gray-400 mb-4">
          <SparklesIcon className="w-4 h-4" />
          <span className="text-sm">Active Model: </span>
          <span className="text-luxury-gold text-sm font-medium">
            {currentModel.split('/')[1]?.split(':')[0] || currentModel}
          </span>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-gray-300 transition-all duration-500 opacity-0 animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <span className="animate-pulse-slow text-luxury-gold mt-1">◆</span>
              <p className="flex-1">{message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}