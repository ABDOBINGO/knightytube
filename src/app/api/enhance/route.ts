import { NextRequest, NextResponse } from 'next/server';
import { enhanceScript } from '@/lib/ai';
import prisma from '@/lib/prisma';
import { handlePrismaError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const { scriptId } = await req.json();

    if (!scriptId) {
      return NextResponse.json(
        { error: 'Script ID is required' },
        { status: 400 }
      );
    }

    try {
      const existingScript = await prisma.script.findUnique({
        where: { id: scriptId },
      });

      if (!existingScript) {
        return NextResponse.json(
          { error: 'Script not found' },
          { status: 404 }
        );
      }

      const enhancedContent = await enhanceScript(existingScript.content);

      const updatedScript = await prisma.script.update({
        where: { id: scriptId },
        data: { 
          enhancedScript: enhancedContent,
          updatedAt: new Date()
        },
      });

      return NextResponse.json({ script: updatedScript });
    } catch (error) {
      console.error('Database operation failed:', error);
      const { message, status } = handlePrismaError(error);
      return NextResponse.json({ error: message }, { status });
    }
  } catch (error) {
    console.error('Error in enhance route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}