import { NextRequest, NextResponse } from 'next/server';
import { enhanceScript } from '@/lib/ai';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { scriptId } = await req.json();

    const script = await prisma.script.findUnique({
      where: { id: scriptId },
    });

    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    const enhancedContent = await enhanceScript(script.content);

    const updatedScript = await prisma.script.update({
      where: { id: scriptId },
      data: { enhancedScript: enhancedContent },
    });

    return NextResponse.json({ script: updatedScript });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}