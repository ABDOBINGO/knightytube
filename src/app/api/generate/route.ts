import { NextRequest, NextResponse } from 'next/server';
import { generateScript } from '@/lib/ai';
import { getVideoTranscript } from '@/lib/youtube';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { topic, youtubeUrl, userId } = await req.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Valid topic string is required' }, { status: 400 });
    }

    // Create or get default user
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
        userId: user.id, // Use the default user's ID
      },
    });

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
}