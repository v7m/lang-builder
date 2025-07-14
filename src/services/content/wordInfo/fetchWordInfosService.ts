import { fetchWoerterWordInfoService } from '@/services/dictionaries/woerter/fetchWoerterWordInfoService';
import type { WordInfo } from '@/types/wordInfo';

async function perform(words: string[]): Promise<WordInfo[]> {
  return fetchWoerterWordInfoService.perform(words);
}

export const fetchWordInfosService = {
  perform
};
