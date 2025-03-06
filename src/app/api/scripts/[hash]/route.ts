import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handlePrismaError } from '@/lib/errors';
import { isValidScriptHash } from '@/utils/hash';

export async function GET(
  req: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    const { hash } = params;

    if (!isValidScriptHash(hash)) {
      return NextResponse.json(
        { error: 'Invalid script hash' },
        { status: 400 }
      );
    }

    const script = await prisma.script.findUnique({
      where: { hash },
      select: {
        id: true,
        hash: true,
        title: true,
        content: true,
        enhancedScript: true,
        youtubeUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Error fetching script:', error);
    const { message, status } = handlePrismaError(error);
    return NextResponse.json({ error: message }, { status });
  }
}