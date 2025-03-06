import { NextRequest, NextResponse } from 'next/server';
import { generateScript } from '@/lib/ai';
import { getVideoTranscript } from '@/lib/youtube';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { topic, youtubeUrl, userId } = await req.json();

    let transcript = null;
    if (youtubeUrl) {
      transcript = await getVideoTranscript(youtubeUrl);
    }

    const script = await generateScript(topic, transcript);

    // Save to database
    const savedScript = await prisma.script.create({
      data: {
        title: topic,
        content: script,
        youtubeUrl,
        transcript,
        userId,
      },
    });

    return NextResponse.json({ script: savedScript });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}