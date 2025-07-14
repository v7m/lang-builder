import { OpenAI } from '@/services/ai-providers/openai';
import { promptsProvider } from '@/services/prompts';
import { DialogData } from '@/types';
import { logger } from '@/services/logger';

const MAX_TOKENS = 6000;
export const MIN_DIALOG_LINES_COUNT = 100;

async function perform(
  wordForms: string[],
  minNumberOfLines = MIN_DIALOG_LINES_COUNT,
  speechNumber: number
): Promise<DialogData> {
  logger.info('Starting dialog generation...');

  const systemPrompt = await promptsProvider.getDialogPrompt(minNumberOfLines, speechNumber);
  const userPrompt = JSON.stringify({ wordForms });

  const textData = (await OpenAI.requestChatCompletionService.perform({
    systemPrompt,
    userPrompt,
    tools: [OpenAI.configs.dialog],
    tool_choice: "auto",
    max_tokens: MAX_TOKENS
  })) as DialogData;

  logger.success(
    'Dialog generated (' + textData.dialog.length + ' lines), ' +
    'words used: ' + Object.keys(textData.wordFormsUsage).filter(word => textData.wordFormsUsage[word] > 0).length,
    { indent: 1 }
  );
  
  return textData;
}

export const generateDialogService = {
  perform
};
