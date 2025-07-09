import { openaiClient } from '../../ai-providers/openai/openaiClient';
import { dialogFunctionConfig } from '../../ai-providers/openai/configs/dialogFunctionConfig';
import * as promptsProvider from '../../utils/promptsProvider';
import { DialogData } from '../../types';
import { logger } from '../logger';

const MAX_TOKENS = 6000;

async function process(wordForms: string[], numberOfLines = 100): Promise<DialogData> {
  logger.info('Starting dialog generation...');
  
  const systemPrompt = await promptsProvider.getDialogPrompt(numberOfLines);
  const userPrompt = JSON.stringify({ wordForms });

  const textData = (await openaiClient.chatCompletionRequest({
    systemPrompt,
    userPrompt,
    tools: [dialogFunctionConfig],
    tool_choice: "auto",
    max_tokens: MAX_TOKENS
  })) as DialogData;

  logger.success('Dialog generated (' + textData.dialog.length + ' lines)', { indent: 1 });
  
  return textData;
}

export const generateDialogService = {
  process
};
