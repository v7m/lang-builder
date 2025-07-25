import { NextRequest, NextResponse } from 'next/server';
import { draftWordEntryService } from '@/services/database';

export async function GET() {
  try {
    const wordEntries = await draftWordEntryService.findAll();
    return NextResponse.json({
      success: true,
      data: wordEntries,
      message: 'Draft word entries retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching draft word entries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch draft word entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wordEntries } = body;

    if (!wordEntries || !Array.isArray(wordEntries)) {
      return NextResponse.json(
        { success: false, error: 'Invalid input: wordEntries array is required' },
        { status: 400 }
      );
    }

    const createdEntries = await draftWordEntryService.createMany(wordEntries);
    
    return NextResponse.json({
      success: true,
      data: createdEntries,
      message: `${createdEntries.length} draft word entries created successfully`
    });
  } catch (error) {
    console.error('Error creating draft word entries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create draft word entries' },
      { status: 500 }
    );
  }
}
