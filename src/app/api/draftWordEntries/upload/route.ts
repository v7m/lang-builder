import { NextRequest, NextResponse } from 'next/server';
import { mongoConnection, draftWordEntryService } from '@/services/database';
import { logger } from '@/services/logger';
import { WordEntry } from '@/types/wordEntry';
import { fetchWordEntriesService } from '@/services/content/wordEntries/fetchWordEntriesService';

async function connectToMongoDb() {
  if (!mongoConnection.isConnectedToDb()) {
    await mongoConnection.connect();
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDb();
    
    const body = await request.json();
    const { inputWordsText } = body;
    
    const validationResult = validateWordsInput(inputWordsText);
    if (!validationResult.isValid) {
      return return400Error(validationResult.error);
    }

    const inputWords = validationResult.inputWordsList!;

    logger.info(`Processing ${inputWords.length} words for upload`);

    const processedWords = await processInputWords(inputWords);

    return returnSuccess(processedWords.length);

  } catch (error) {
    logger.error('Error in upload endpoint:', error);
    return return500Error('Internal server error');
  }
}

function validateWordsInput(inputWordsText: unknown): {
  isValid: boolean;
  error?: string;
  inputWordsList?: string[];
} {
  if (!inputWordsText || typeof inputWordsText !== 'string') {
    return { isValid: false, error: 'Words text is required' };
  }

  const inputWordsList = extractInputWords(inputWordsText);

  if (inputWordsList.length === 0) {
    return { isValid: false, error: 'No valid words found' };
  }

  return { isValid: true, inputWordsList };
}

function return400Error(error: string | undefined) {
  return NextResponse.json(
    { success: false, error },
    { status: 400 }
  );
}

function return500Error(error: string) {
  return NextResponse.json(
    { success: false, error },
    { status: 500 }
  );
}

function returnSuccess(processedWordsCount: number) {
  return NextResponse.json({
    success: true,
    message: `Received ${processedWordsCount} words for processing in draft`,
    data: { processedWordsCount }
  });
}

function extractInputWords(inputWordsText: string): string[] {
  return inputWordsText
    .split('\n')
    .map(word => word.trim())
    .filter(word => word.length > 0);
}

async function processInputWords(inputWords: string[]): Promise<WordEntry[]> {
  const wordEntries = await fetchWordEntries(inputWords);
  const savedWordEntries = await saveWordEntriesToDatabase(wordEntries);

  return savedWordEntries;
}

async function fetchWordEntries(inputWords: string[]): Promise<WordEntry[]> {
  const wordEntries = await fetchWordEntriesService.perform(inputWords);

  return wordEntries;
}

async function saveWordEntriesToDatabase(wordEntries: WordEntry[]): Promise<WordEntry[]> {
  try {
    logger.info('Saving word entries to draft database...');

    const savedWordEntries = await draftWordEntryService.createMany(wordEntries);
    logger.success(`✅ Saved ${savedWordEntries.length} word entries to draft database`, { indent: 1 });

    const allEntries = await draftWordEntryService.findAll();
    logger.info(`All draft entries count: ${allEntries.length}`, { indent: 1 });

    return savedWordEntries;
  } catch (error) {
    logger.error('❌ Error saving word entries to draft database:', error);
    throw error;
  }
}
