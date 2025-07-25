import { NextRequest, NextResponse } from 'next/server';
import { wordEntryService } from '@/services/database';
import { draftWordEntryService } from '@/services/database';
import { logger } from '@/services/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the word entry from main collection
    const mainEntry = await wordEntryService.findById(params.id);
    if (!mainEntry) {
      return NextResponse.json(
        { success: false, error: 'Word entry not found' },
        { status: 404 }
      );
    }

    // Create entry in draft collection
    const draftEntry = await draftWordEntryService.create({
      word: mainEntry.word,
      grammar: mainEntry.grammar,
      forms: mainEntry.forms,
      translations: mainEntry.translations,
      examples: mainEntry.examples
    });

    // Delete from main collection
    await wordEntryService.delete(params.id);

    logger.success(`✅ Word "${mainEntry.word}" moved from approved to draft collection`);
    return NextResponse.json({
      success: true,
      data: draftEntry,
      message: 'Word moved to draft collection successfully'
    });
  } catch (error) {
    logger.error('❌ Error moving word entry to draft:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to move word entry to draft' },
      { status: 500 }
    );
  }
}
