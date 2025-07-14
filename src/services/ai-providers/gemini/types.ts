import type { MultiSpeakerConfig } from './configs/multiSpeakerConfig';

export interface GenerateSpeechRequest {
  model?: string;
  prompt: string;
  generationConfig?: MultiSpeakerConfig;
}
