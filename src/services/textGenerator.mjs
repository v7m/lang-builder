import { openaiClient } from '../ai-providers/openai/openaiClient.mjs';
import { dialogSchema } from '../ai-providers/openai/requests/dialogSchema.mjs';
import * as promptsProvider from '../utils/prompts_provider.mjs';

const MAX_TOKENS = 6000;

async function generateDialog(wordForms, numberOfLines = 100) {
  console.log('📤 Generating dialog text from AI started');
  
  const systemPrompt = promptsProvider.getDialogPrompt(numberOfLines);
  const userPrompt = JSON.stringify({ wordForms });

  const textData = await openaiClient.chatCompletionRequest({
    systemPrompt,
    userPrompt,
    tools: [dialogSchema],
    tool_choice: "auto",
    max_tokens: MAX_TOKENS
  });

  logGeneratedText(textData);

  return textData;
}

async function generateMonologue() {
  throw new Error('Not implemented yet');
}

function logGeneratedText(textData) {
  console.log('\n📝 Text data generated:\n');
  // console.log(textData);
  
  if (textData.dialog) {
    console.log(`\nDialog lines count: ${textData.dialog.length}`);
  }
}

export const textGenerator = {
  generateDialog,
  generateMonologue
}; 
