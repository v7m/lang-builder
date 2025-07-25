import { NextResponse } from 'next/server';
import { mongoConnection, wordEntryService } from '@/services/database';
import { logger } from '@/services/logger';

export async function GET() {
  try {
    await connectToMongoDb();

    const wordEntries = await wordEntryService.findAll();
    logger.info(`Found ${wordEntries.length} word entries`);
    logger.info('Sample entry:', wordEntries[0]);
    
    return NextResponse.json({ 
      success: true, 
      data: wordEntries,
      count: wordEntries.length 
    });
  } catch (error) {
    logger.error('Error in GET /api/wordEntries:', error);
    logger.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch word entries',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function connectToMongoDb() {
  if (!mongoConnection.isConnectedToDb()) {
    logger.info('Connecting to MongoDB...');
    await mongoConnection.connect();
    logger.info('MongoDB connected successfully');
  }
}
