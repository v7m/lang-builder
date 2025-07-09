import { httpClient } from '../httpClient';
import { WorterParser } from './parsers/worterParser';
import { WordInfo } from '../../types/wordInfo';

const WOERTER_BASE_URL = 'https://www.woerter.net/';

async function process(words: string[]): Promise<WordInfo[]> {
  const wordInfos: WordInfo[] = [];

  for (const word of words) {
    const url = worterUrl(word);

    const { data: html } = await httpClient.get(url);
    const wordInfo = WorterParser.parseHtml(html);

    wordInfos.push(wordInfo);
  }

  return wordInfos;
}

function worterUrl(word: string): string {
  return `${WOERTER_BASE_URL}?w=${encodeURIComponent(word)}`;
}

export const fetchWordInfosService = {
  process
};
