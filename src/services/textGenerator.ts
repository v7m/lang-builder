import { openaiClient } from '../ai-providers/openai/openaiClient';
import { dialogFunctionConfig } from '../ai-providers/openai/configs/dialogFunctionConfig';
import * as promptsProvider from '../utils/promptsProvider';
import { DialogData } from '../types';

const MAX_TOKENS = 6000;

async function generateDialog(wordForms: string[], numberOfLines = 100): Promise<DialogData> {
  console.log('\n📖 Starting dialog generation...');
  
  const systemPrompt = await promptsProvider.getDialogPrompt(numberOfLines);
  const userPrompt = JSON.stringify({ wordForms });

  const textData = (await openaiClient.chatCompletionRequest({
    systemPrompt,
    userPrompt,
    tools: [dialogFunctionConfig],
    tool_choice: "auto",
    max_tokens: MAX_TOKENS
  })) as DialogData;

  console.log('    ℹ️ Dialog generated (' + textData.dialog.length + ' lines)');
  
  return textData;
}

async function generateMonologue(): Promise<never> {
  throw new Error('Not implemented yet');
}

export const textGenerator = {
  generateDialog,
  generateMonologue
};
