import pLimit from 'p-limit';

import { Gemini } from '@/services/ai-providers/gemini';
import { promptsProvider } from '@/services/prompts';
import { logger } from '@/services/logger';
import { MultiSpeakerConfig } from '@/services/ai-providers/gemini/configs/multiSpeakerConfig';

const SPEECH_REQUESTS_LIMIT = pLimit(3);

async function perform(textChunks: string[]): Promise<Buffer[]> {
  logger.info('Starting speech generation...');

  const generationConfig = getGenerationConfig();
  const bufferPromises = textChunks.map((chunk, index) =>
    SPEECH_REQUESTS_LIMIT(async () => {
      logger.info(`Processing part ${index + 1} (${chunk.length} characters)...`, { indent: 1 });

      return Gemini.generateSpeechService.perform({
        prompt: await getTextWithSpeechInstruction(chunk),
        generationConfig
      });
    })
  );

  const audioData = await Promise.all(bufferPromises);

  logger.success('Speech generation completed', { indent: 1 });

  return audioData;
}

const getTextWithSpeechInstruction = async (text: string): Promise<string> => {
  const speechInstructions = await promptsProvider.getSpeechInstructions();

  return `${speechInstructions.trim()}\n${text}`;
}

const getGenerationConfig = (): MultiSpeakerConfig => {
  return Gemini.configs.multiSpeaker({
    femaleVoice: getRandomVoice(Gemini.voices.female),
    maleVoice: getRandomVoice(Gemini.voices.male)
  });
}

const getRandomVoice = (voices: string[]): string => {
  return voices[Math.floor(Math.random() * voices.length)];
}

export const generateMultiSpeakerSpeechService = {
  perform
};
