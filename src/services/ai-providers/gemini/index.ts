import { generateTextToSpeechService } from './generateTextToSpeechService';
import { multiSpeakerConfig } from './configs/multiSpeakerConfig';
import type { TextToSpeechRequest } from './types';

export const Gemini = {
  generateTextToSpeechService,
  configs: {
    multiSpeaker: multiSpeakerConfig
  }
} as const;

export type { TextToSpeechRequest }; 