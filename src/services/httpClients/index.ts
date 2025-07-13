// Core HTTP clients
import { baseClient } from './core/baseClient';
import { clientWithDelay } from './core/clientWithDelay';

// Dictionary clients
import { woerterClient } from './dictionary/woerterClient';

// AI clients
import { openaiClient } from './ai/openaiClient';
import { geminiClient } from './ai/geminiClient';

export const httpClient = {
  DEFAULT_TIMEOUT_MS: baseClient.DEFAULT_TIMEOUT_MS,
  createBase: baseClient.create,
  createWithDelay: clientWithDelay.create,
  createWoerterClient: woerterClient.create,
  createOpenaiClient: openaiClient.create,
  createGeminiClient: geminiClient.create
};
