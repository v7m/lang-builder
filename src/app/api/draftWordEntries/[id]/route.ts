import { NextRequest, NextResponse } from 'next/server';
import { draftWordEntryService } from '@/services/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedEntry = await draftWordEntryService.update(params.id, body);
    
    if (!updatedEntry) {
      return NextResponse.json(
        { success: false, error: 'Draft word entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEntry,
      message: 'Draft word entry updated successfully'
    });
  } catch (error) {
    console.error('Error updating draft word entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update draft word entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await draftWordEntryService.delete(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Draft word entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Draft word entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting draft word entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete draft word entry' },
      { status: 500 }
    );
  }
}
