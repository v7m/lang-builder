import { OpenAI } from '@/services/ai-providers/openai';
import { promptsProvider } from '@/services/prompts';
import { WordEntry } from '@/types/wordEntry';
import { logger } from '@/services/logger';

const MAX_TOKENS = 6000;

interface WordEntriesResponse {
  count: number;
  wordEntries: WordEntry[];
}

async function perform(words: string[]): Promise<WordEntriesResponse> {
  logger.info('Starting word entries generation...');
  
  const systemPrompt = await promptsProvider.getWordEntriesPrompt(words);
  const userPrompt = JSON.stringify({ words });

  const wordEntries = (await OpenAI.requestChatCompletionService.perform({
    systemPrompt,
    userPrompt,
    tools: [OpenAI.configs.wordEntries],
    tool_choice: "auto",
    max_tokens: MAX_TOKENS
  })) as WordEntriesResponse;

  logger.success('Word entries generated (' + wordEntries.wordEntries.length + ' words)', { indent: 1 });

  return wordEntries;
}

export const generateWordEntriesService = {
  perform
};
