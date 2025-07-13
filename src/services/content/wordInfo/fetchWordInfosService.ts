import { woerterClient } from '@/services/httpClients';
import { WorterParser } from './parsers/WorterParser';
import { WordInfo } from '@/types/wordInfo';
import { logger } from '@/services/logger';

const WOERTER_BASE_URL = 'https://www.woerter.net/';

async function process(words: string[]): Promise<WordInfo[]> {
  logger.info('Fetching word infos...');

  const wordInfos: WordInfo[] = [];

  for (const word of words) {
    const url = `${WOERTER_BASE_URL}?w=${encodeURIComponent(word)}`;

    const { data: html } = await woerterClient.get(url);
    const wordInfo = WorterParser.parseHtml(html);

    wordInfos.push(wordInfo);
  }

  logger.success('Word infos fetched');

  return wordInfos;
}

export const fetchWordInfosService = {
  process
};
