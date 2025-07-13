import { openaiClient } from '@/services/ai-providers/openai/openaiClient';
import { dialogFunctionConfig } from '@/services/ai-providers/openai/configs/dialogFunctionConfig';
import { promptsProvider } from '@/services/prompts';
import { DialogData } from '@/types';
import { logger } from '@/services/logger';

const MAX_TOKENS = 6000;
export const DIALOG_LINES_COUNT = 100;

async function process(
  wordForms: string[],
  numberOfLines = DIALOG_LINES_COUNT,
  speechNumber: number
): Promise<DialogData> {
  logger.info('Starting dialog generation...');

  const systemPrompt = await promptsProvider.getDialogPrompt(numberOfLines, speechNumber);
  const userPrompt = JSON.stringify({ wordForms });

  const textData = (await openaiClient.chatCompletionRequest({
    systemPrompt,
    userPrompt,
    tools: [dialogFunctionConfig],
    tool_choice: "auto",
    max_tokens: MAX_TOKENS
  })) as DialogData;

  logger.debug(textData);

  logger.success('Dialog generated (' + textData.dialog.length + ' lines)', { indent: 1 });
  
  return textData;
}

export const generateDialogService = {
  process
};
