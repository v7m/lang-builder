import pLimit from 'p-limit';

import { geminiClient } from '../../ai-providers/gemini/geminiClient';
import { multiSpeakerConfig } from '../../ai-providers/gemini/configs/multiSpeakerConfig';
import * as promptsProvider from '../../utils/promptsProvider';
import { logger } from '../logger';

const SPEECH_REQUESTS_LIMIT = pLimit(3);

async function process(textChunks: string[]): Promise<Buffer[]> {
  logger.info('Starting speech generation...');

  const speechInstructions = await promptsProvider.getSpeechInstructions();

  const bufferPromises = textChunks.map((chunk, index) =>
    SPEECH_REQUESTS_LIMIT(() => {
      logger.info(`Processing part ${index + 1} (${chunk.length} characters)...`, { indent: 1 });

      const textWithInstruction = `${speechInstructions.trim()}\n${chunk}`;

      return geminiClient.textToSpeechRequest({
        prompt: textWithInstruction,
        generationConfig: multiSpeakerConfig
      });
    })
  );
  
  const audioData = await Promise.all(bufferPromises);

  logger.success('Speech generation completed', { indent: 1 });

  return audioData;
}

export const generateMultiSpeakerSpeechService = {
  process
};
