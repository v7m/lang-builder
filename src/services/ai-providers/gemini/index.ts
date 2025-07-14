import { generateSpeechService } from './generateSpeechService';
import { multiSpeakerConfig, GEMINI_FEMALE_VOICES, GEMINI_MALE_VOICES } from './configs/multiSpeakerConfig';
import type { GenerateSpeechRequest } from './types';

export const Gemini = {
  generateSpeechService,
  configs: {
    multiSpeaker: multiSpeakerConfig
  },
  voices: {
    female: GEMINI_FEMALE_VOICES,
    male: GEMINI_MALE_VOICES
  }
} as const;

export type { GenerateSpeechRequest };
