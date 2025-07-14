import { httpClient } from '@/services/httpClients';
import { WorterParser } from './parsers/WorterParser';
import type { WordEntry } from '@/types/wordEntry';
import { logger } from '@/services/logger';

const WOERTER_BASE_URL = 'https://www.woerter.net/';
const client = httpClient.createWoerterClient();

async function fetchSingleWord(word: string): Promise<WordEntry> {
  const url = `${WOERTER_BASE_URL}?w=${encodeURIComponent(word)}`;
  const { data: html } = await client.get(url);

  return WorterParser.parseHtml(html);
}

async function perform(words: string[]): Promise<WordEntry[]> {
  logger.info('Fetching word entries from woerter.net...');

  const wordEntries: WordEntry[] = [];
  for (const word of words) {
    const wordEntry = await fetchSingleWord(word);
    wordEntries.push(wordEntry);
  }

  logger.success('Word entries fetched from woerter.net');

  return wordEntries;
}

export const fetchWoerterWordEntriesService = {
  perform
}; 