import { openaiClient } from '../ai-providers/openai/openaiClient';
import { wordsDataFunctionConfig } from '../ai-providers/openai/configs/wordsDataFunctionConfig';
import * as promptsProvider from '../utils/promptsProvider';
import { WordData } from '../types';

const MAX_TOKENS = 6000;

interface WordsDataResponse {
  count: number;
  words_data: WordData[];
}

async function generateWordDefinitions(words: string[]): Promise<WordsDataResponse> {
  console.log('\n📝 Starting word definitions generation...');
  
  const systemPrompt = await promptsProvider.getWordsDataPrompt(words);
  const userPrompt = JSON.stringify({ words });

  const wordDefinitions = (await openaiClient.chatCompletionRequest({
    systemPrompt,
    userPrompt,
    tools: [wordsDataFunctionConfig],
    tool_choice: "auto",
    max_tokens: MAX_TOKENS
  })) as WordsDataResponse;

  console.log('    ℹ️ Word definitions generated (' + wordDefinitions.words_data.length + ' words)');

  return wordDefinitions;
}

export const dictionaryService = {
  generateWordDefinitions
};
