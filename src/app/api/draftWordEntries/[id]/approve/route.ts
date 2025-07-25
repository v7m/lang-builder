import { NextRequest, NextResponse } from 'next/server';
import { draftWordEntryService } from '@/services/database';
import { logger } from '@/services/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const promotedEntry = await draftWordEntryService.promoteToMain(params.id);
    if (!promotedEntry) {
      return NextResponse.json(
        { success: false, error: 'Draft word entry not found' },
        { status: 404 }
      );
    }

    logger.success(`✅ Word approved and moved to main collection: ${promotedEntry.word}`);

    return NextResponse.json({
      success: true,
      data: promotedEntry,
      message: 'Word approved and moved to main collection successfully'
    });
  } catch (error) {
    logger.error('❌ Error approving draft word entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve draft word entry' },
      { status: 500 }
    );
  }
}
