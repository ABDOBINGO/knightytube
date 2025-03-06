import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL,
    'X-Title': 'KnightyTube Script Generator',
  },
});

export async function generateScript(topic: string, transcript?: string) {
  const messages = [
    {
      role: 'system',
      content: 'You are an expert YouTube script writer that creates engaging, well-structured content.'
    },
    {
      role: 'user',
      content: transcript 
        ? `Create a YouTube script about ${topic}. Use this transcript as reference and improve upon it: ${transcript}`
        : `Create an engaging YouTube script about ${topic}. Include introduction, main points, and call to action.`
    }
  ];

  const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.0-pro-exp-02-05:free',
    messages: messages as any,
  });

  return completion.choices[0].message.content;
}

export async function enhanceScript(script: string) {
  const completion = await openai.chat.completions.create({
    model: 'deepseek/deepseek-r1:free',
    messages: [
      {
        role: 'system',
        content: 'You are an expert content enhancer. Improve scripts while maintaining their core message.'
      },
      {
        role: 'user',
        content: `Enhance this YouTube script by improving engagement, adding hooks, and making it more conversational: ${script}`
      }
    ],
  });

  return completion.choices[0].message.content;
}