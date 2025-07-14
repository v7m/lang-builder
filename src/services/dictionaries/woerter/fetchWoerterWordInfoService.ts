import { httpClient } from '@/services/httpClients';
import { WorterParser } from './parsers/WorterParser';
import type { WordInfo } from '@/types/wordInfo';
import { logger } from '@/services/logger';

const WOERTER_BASE_URL = 'https://www.woerter.net/';
const client = httpClient.createWoerterClient();

async function fetchSingleWord(word: string): Promise<WordInfo> {
  const url = `${WOERTER_BASE_URL}?w=${encodeURIComponent(word)}`;
  const { data: html } = await client.get(url);

  return WorterParser.parseHtml(html);
}

async function perform(words: string[]): Promise<WordInfo[]> {
  logger.info('Fetching word infos from woerter.net...');

  const wordInfos: WordInfo[] = [];
  for (const word of words) {
    const wordInfo = await fetchSingleWord(word);
    wordInfos.push(wordInfo);
  }

  logger.success('Word infos fetched from woerter.net');

  return wordInfos;
}

export const fetchWoerterWordInfoService = {
  perform
}; 