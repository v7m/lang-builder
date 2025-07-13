import { OpenAI } from '@/services/ai-providers/openai';
import { promptsProvider } from '@/services/prompts';
import { WordInfo } from '@/types/wordInfo';
import { logger } from '@/services/logger';

const MAX_TOKENS = 6000;

interface WordInfosResponse {
  count: number;
  wordInfos: WordInfo[];
}

async function perform(words: string[]): Promise<WordInfosResponse> {
  logger.info('Starting word infos generation...');
  
  const systemPrompt = await promptsProvider.getWordInfosPrompt(words);
  const userPrompt = JSON.stringify({ words });

  const wordInfos = (await OpenAI.requestChatCompletionService.perform({
    systemPrompt,
    userPrompt,
    tools: [OpenAI.configs.wordInfos],
    tool_choice: "auto",
    max_tokens: MAX_TOKENS
  })) as WordInfosResponse;

  logger.success('Word infos generated (' + wordInfos.wordInfos.length + ' words)', { indent: 1 });

  return wordInfos;
}

export const generateWordInfosService = {
  perform
};
