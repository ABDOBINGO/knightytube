import OpenAI from 'openai';
import type { ChatMessage } from '@/types';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL,
    'X-Title': 'KnightyTube Script Generator',
  },
});

export async function generateScript(topic: string, transcript?: string) {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are an expert YouTube script writer specializing in creating highly engaging, well-structured content.
Your task is to create a compelling script that includes:
- A powerful hook in the first 15 seconds
- Clear and engaging introduction
- Well-organized main points with smooth transitions
- Relevant examples and stories
- Call-to-action and engaging outro
- Natural, conversational tone throughout
Make sure to maintain viewer engagement with pattern interrupts and emotional hooks.`
    },
    {
      role: 'user',
      content: transcript 
        ? `Create a captivating YouTube script about "${topic}". Use this transcript as reference and improve upon it while maintaining its core message: ${transcript}

Focus on:
1. Making the content more engaging and conversational
2. Adding emotional hooks and storytelling elements
3. Improving the structure and flow
4. Including clear calls-to-action`
        : `Create an engaging YouTube script about "${topic}". 

Include:
1. An attention-grabbing hook
2. Clear introduction and topic overview
3. Main points with examples and stories
4. Engaging transitions between sections
5. Strong conclusion and call-to-action
6. Natural, conversational language throughout`
    }
  ];

  const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.0-pro-exp-02-05:free',
    messages,
    temperature: 0.7,
    max_tokens: 2500,
  });

  return completion.choices[0].message.content;
}

export async function enhanceScript(script: string) {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are an expert content enhancer specializing in YouTube scripts.
Your task is to improve scripts while maintaining their core message by:
- Adding emotional hooks and storytelling elements
- Improving pacing and flow
- Making the language more conversational and engaging
- Adding pattern interrupts to maintain viewer attention
- Enhancing transitions between sections
- Strengthening calls-to-action`
    },
    {
      role: 'user',
      content: `Enhance this YouTube script by making it more engaging and professional:

${script}

Focus on:
1. Making the content more dynamic and engaging
2. Adding storytelling elements and examples
3. Improving transitions and flow
4. Making the language more conversational
5. Strengthening hooks and calls-to-action
6. Maintaining the core message while enhancing delivery`
    }
  ];

  const completion = await openai.chat.completions.create({
    model: 'deepseek/deepseek-r1:free',
    messages,
    temperature: 0.7,
    max_tokens: 3000,
  });

  return completion.choices[0].message.content;
}