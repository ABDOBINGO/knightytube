import { ChatMessage } from '@/types';
import axios from 'axios';
import { conductWebResearch } from './research';

export async function generateScript(topic: string, transcript?: string): Promise<string> {
  try {
    // Conduct web research
    const research = await conductWebResearch(topic);
    
    const systemPrompt = `You are a professional YouTube script writer. Create an engaging script based on the topic, research, and any provided transcript. 
    Focus on creating content that is informative, entertaining, and optimized for viewer retention.
    
    Research Sources:
    ${research.results.map(r => `- ${r.title} (${r.source}): ${r.snippet}`).join('\n')}
    
    Search Queries Used:
    ${research.searchQueries.join('\n')}`;

    const userPrompt = transcript
      ? `Write a YouTube script about "${topic}". Use this reference video transcript as inspiration:\n${transcript}\n\nIncorporate insights from the research provided while maintaining originality.`
      : `Write a YouTube script about "${topic}". Use the research provided to create informative and engaging content.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await axios.post('https://api.openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.0-pro-exp-02-05:free',
      messages,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL,
        'X-Title': 'KnightyTube'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script');
  }
}

export async function enhanceScript(content: string): Promise<string> {
  try {
    const systemPrompt = `You are an expert script editor specializing in YouTube content optimization. 
    Enhance the given script by:
    1. Improving audience engagement
    2. Adding hooks and retention techniques
    3. Optimizing for SEO and discoverability
    4. Ensuring natural, conversational tone
    5. Adding time markers and structure`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Enhance this script:\n\n${content}` }
    ];

    const response = await axios.post('https://api.openrouter.ai/api/v1/chat/completions', {
      model: 'deepseek/deepseek-r1:free',
      messages,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL,
        'X-Title': 'KnightyTube'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error enhancing script:', error);
    throw new Error('Failed to enhance script');
  }
}