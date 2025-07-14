import { fetchWoerterWordEntriesService } from '@/services/dictionaries/woerter/fetchWoerterWordEntriesService';
import type { WordEntry } from '@/types/wordEntry';

async function perform(words: string[]): Promise<WordEntry[]> {
  return fetchWoerterWordEntriesService.perform(words);
}

export const fetchWordEntriesService = {
  perform
};
