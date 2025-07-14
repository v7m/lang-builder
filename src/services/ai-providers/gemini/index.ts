import { generateSpeechService } from './generateSpeechService';
import { multiSpeakerConfig } from './configs/multiSpeakerConfig';
import type { GenerateSpeechRequest } from './types';

export const Gemini = {
  generateSpeechService,
  configs: {
    multiSpeaker: multiSpeakerConfig
  }
} as const;

export type { GenerateSpeechRequest };
