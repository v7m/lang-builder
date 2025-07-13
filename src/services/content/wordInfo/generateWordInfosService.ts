import { openaiClient } from '@/services/ai-providers/openai/openaiClient';
import { wordInfosFunctionConfig } from '@/services/ai-providers/openai/configs/wordInfosFunctionConfig';
import { promptsProvider } from '@/services/prompts';
import { WordInfo } from '@/types/wordInfo';
import { logger } from '@/services/logger';

const MAX_TOKENS = 6000;

interface WordInfosResponse {
  count: number;
  wordInfos: WordInfo[];
}

async function process(words: string[]): Promise<WordInfosResponse> {
  logger.info('Starting word definitions generation...');
  
  const systemPrompt = await promptsProvider.getWordInfosPrompt(words);
  const userPrompt = JSON.stringify({ words });

  const wordDefinitions = (await openaiClient.chatCompletionRequest({
    systemPrompt,
    userPrompt,
    tools: [wordInfosFunctionConfig],
    tool_choice: "auto",
    max_tokens: MAX_TOKENS
  })) as WordInfosResponse;

  logger.success('Word definitions generated (' + wordDefinitions.wordInfos.length + ' words)', { indent: 1 });

  return wordDefinitions;
}

export const generateWordInfosService = {
  process
};
