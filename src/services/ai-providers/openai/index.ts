import { requestChatCompletionService } from './requestChatCompletionService';
import { dialogFunctionConfig } from './configs/dialogFunctionConfig';
import { wordEntriesFunctionConfig } from './configs/wordEntriesFunctionConfig';
import type { ChatCompletionOptions } from './types';

export const OpenAI = {
  requestChatCompletionService,
  configs: {
    dialog: dialogFunctionConfig,
    wordEntries: wordEntriesFunctionConfig
  }
} as const;

export type { ChatCompletionOptions }; 