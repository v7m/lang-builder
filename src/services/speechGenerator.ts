import pLimit from 'p-limit';

import { geminiClient } from '../ai-providers/gemini/geminiClient';
import { multiSpeakerConfig } from '../ai-providers/gemini/configs/multiSpeakerConfig';
import * as promptsProvider from '../utils/promptsProvider';

const SPEECH_REQUESTS_LIMIT = pLimit(3);

async function generateMultiSpeakerSpeechFromChunks(textChunks: string[]): Promise<Buffer[]> {
  console.log('\n🎙️ Starting speech generation...');

  const speechInstructions = await promptsProvider.getSpeechInstructions();

  const bufferPromises = textChunks.map((chunk, index) =>
    SPEECH_REQUESTS_LIMIT(() => {
      console.log(`    ℹ️ Processing part ${index + 1} (${chunk.length} characters)...`);
      // console.log(`${chunk} \n`);

      const textWithInstruction = `${speechInstructions.trim()}\n${chunk}`;

      return geminiClient.textToSpeechRequest({
        prompt: textWithInstruction,
        generationConfig: multiSpeakerConfig
      });
    })
  );
  
  const audioData = await Promise.all(bufferPromises);

  console.log('    ℹ️ All parts processed');

  return audioData;
}

export const speechGenerator = {
  generateMultiSpeakerSpeechFromChunks
};
