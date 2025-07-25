import { NextRequest, NextResponse } from 'next/server';
import { mongoConnection, wordEntryService } from '@/services/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDb();

    const { id } = params;
    const body = await request.json();
    
    const updatedEntry = await wordEntryService.update(id, body);
    
    if (updatedEntry) {
      return NextResponse.json({ 
        success: true, 
        message: 'Word entry updated successfully',
        data: updatedEntry
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Word entry not found' 
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error updating word entry:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update word entry',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongoDb();

    const { id } = params;
    const deleted = await wordEntryService.delete(id);
    
    if (deleted) {
      return NextResponse.json({ 
        success: true, 
        message: 'Word entry deleted successfully' 
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Word entry not found' 
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting word entry:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete word entry',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 

async function connectToMongoDb() {
  if (!mongoConnection.isConnectedToDb()) {
    await mongoConnection.connect();
  }
}
