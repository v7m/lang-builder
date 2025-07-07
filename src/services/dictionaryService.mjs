import { openaiClient } from '../ai-providers/openai/openaiClient.mjs';
import { wordsDataSchema } from '../ai-providers/openai/requests/wordsDataSchema.mjs';
import * as promptsProvider from '../utils/prompts_provider.mjs';

const MAX_TOKENS = 6000;

async function generateWordDefinitions(words) {
  console.log('📤 Generating word definitions from AI started');
  
  const systemPrompt = promptsProvider.getWordsDataPrompt(words);
  const userPrompt = JSON.stringify({ words });

  const wordDefinitions = await openaiClient.chatCompletionRequest({
    systemPrompt,
    userPrompt,
    tools: [wordsDataSchema],
    tool_choice: "auto",
    max_tokens: MAX_TOKENS
  });

  console.log('\n📝 Word definitions generated:\n', wordDefinitions);
  
  return wordDefinitions;
}

export const dictionaryService = {
  generateWordDefinitions
};
