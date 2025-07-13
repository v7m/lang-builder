import { requestChatCompletionService } from './requestChatCompletionService';
import { dialogFunctionConfig } from './configs/dialogFunctionConfig';
import { wordInfosFunctionConfig } from './configs/wordInfosFunctionConfig';
import type { ChatCompletionOptions } from './types';

export const OpenAI = {
  requestChatCompletionService,
  configs: {
    dialog: dialogFunctionConfig,
    wordInfos: wordInfosFunctionConfig
  }
} as const;

export type { ChatCompletionOptions }; 