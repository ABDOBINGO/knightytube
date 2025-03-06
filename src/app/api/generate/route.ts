import { NextRequest, NextResponse } from 'next/server';
import { generateScript } from '@/lib/ai';
import { getVideoTranscript } from '@/lib/youtube';
import { conductWebResearch } from '@/lib/research';
import prisma from '@/lib/prisma';
import { handlePrismaError } from '@/lib/errors';
import { generateScriptHash } from '@/utils/hash';
import { ResearchResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { topic, youtubeUrl } = await req.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Valid topic string is required' },
        { status: 400 }
      );
    }

    const streamWriter = new TransformStream();
    const writer = streamWriter.writable.getWriter();
    const encoder = new TextEncoder();

    const writeStatus = async (message: string) => {
      await writer.write(encoder.encode(`data: ${JSON.stringify({ status: message })}\n\n`));
    };

    try {
      const user = await prisma.user.upsert({
        where: { email: 'default@example.com' },
        update: {},
        create: {
          email: 'default@example.com',
          name: 'Default User',
        },
      });

      let transcript: string | undefined = undefined;
      let researchData: { results: ResearchResult[], searchQueries: string[] } | undefined;
      
      // Handle YouTube transcript
      if (youtubeUrl && typeof youtubeUrl === 'string') {
        await writeStatus('🎥 Analyzing YouTube video...');
        try {
          transcript = await getVideoTranscript(youtubeUrl, (status) => {
            writeStatus(`📝 ${status}`);
          });
          await writeStatus('✅ Video transcript extracted successfully');
        } catch (error) {
          if (error instanceof Error) {
            console.warn('Transcript fetch warning:', error.message);
            await writeStatus(`⚠️ ${error.message}`);
            if (error.message.includes('Invalid YouTube URL')) {
              throw error;
            }
          }
        }
      }

      // Conduct web research
      await writeStatus('🔍 Conducting web research...');
      try {
        researchData = await conductWebResearch(topic);
        await writeStatus(`📚 Found ${researchData.results.length} relevant sources...`);
      } catch (error) {
        console.warn('Research warning:', error);
        await writeStatus('⚠️ Some research sources may be unavailable');
      }

      // Generate script
      await writeStatus('✨ Analyzing research and generating script...');
      const content = await generateScript(topic, transcript);
      
      const hash = generateScriptHash();

      // Create script with research data
      const script = await prisma.script.create({
        data: {
          title: topic,
          content,
          youtubeUrl: typeof youtubeUrl === 'string' ? youtubeUrl : null,
          transcript: transcript ?? null,
          userId: user.id,
          hash,
          researchData: researchData ? {
            create: {
              searchQueries: JSON.stringify(researchData.searchQueries),
              sources: {
                create: researchData.results.map(result => ({
                  title: result.title,
                  url: result.url,
                  snippet: result.snippet,
                  source: result.source
                }))
              }
            }
          } : undefined
        },
        include: {
          researchData: {
            include: {
              sources: true
            }
          }
        }
      });

      await writeStatus('✅ Script generated successfully!');
      await writer.write(encoder.encode(`data: ${JSON.stringify({ script })}\n\n`));
      await writer.close();

      return new Response(streamWriter.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });

    } catch (error) {
      console.error('Operation failed:', error);
      const { message, status } = handlePrismaError(error);
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
      await writer.close();
      return new Response(streamWriter.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}