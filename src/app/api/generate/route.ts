import { NextRequest, NextResponse } from 'next/server';
import { generateScript } from '@/lib/ai';
import { getVideoTranscript } from '@/lib/youtube';
import prisma from '@/lib/prisma';
import { handlePrismaError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const { topic, youtubeUrl } = await req.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Valid topic string is required' },
        { status: 400 }
      );
    }

    // Create or get default user
    try {
      const user = await prisma.user.upsert({
        where: {
          email: 'default@example.com',
        },
        update: {},
        create: {
          email: 'default@example.com',
          name: 'Default User',
        },
      });

      let transcript: string | undefined = undefined;
      if (youtubeUrl && typeof youtubeUrl === 'string') {
        try {
          const transcriptResult = await getVideoTranscript(youtubeUrl);
          transcript = typeof transcriptResult === 'string' ? transcriptResult : undefined;
        } catch (error) {
          console.error('Error fetching transcript:', error);
        }
      }

      const content = await generateScript(topic, transcript);

      const script = await prisma.script.create({
        data: {
          title: topic,
          content,
          youtubeUrl: typeof youtubeUrl === 'string' ? youtubeUrl : null,
          transcript: transcript ?? null,
          userId: user.id,
        },
      });

      return NextResponse.json({ script });
    } catch (error) {
      console.error('Database operation failed:', error);
      const { message, status } = handlePrismaError(error);
      return NextResponse.json({ error: message }, { status });
    }
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}