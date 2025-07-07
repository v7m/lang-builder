import pLimit from 'p-limit';

import { geminiClient } from '../ai-providers/gemini/geminiClient.mjs';
import { multiSpeakerConfig } from '../ai-providers/gemini/requests/multiSpeakerConfig.mjs';
import * as promptsProvider from '../utils/prompts_provider.mjs';

const SPEECH_REQUESTS_LIMIT = pLimit(3);

async function generateMultiSpeakerSpeechFromChunks(textChunks) {
  console.log('\n🎙️ Generating speech from AI started');

  const speechInstructions = promptsProvider.getSpeechInstructions();

  const bufferPromises = textChunks.map((chunk, index) =>
    SPEECH_REQUESTS_LIMIT(() => {
      console.log(`\n🎙️ Generating speech for text chunk #${index + 1}...`);
      console.log(`Text chunk length: ${chunk.length}`);
      console.log(`${chunk} \n`);

      const textWithInstruction = `${speechInstructions.trim()}\n${chunk}`;

      return geminiClient.textToSpeechRequest({
        prompt: textWithInstruction,
        generationConfig: multiSpeakerConfig()
      });
    })
  );
  
  const audioData = await Promise.all(bufferPromises);

  console.log('\n🎙️ Speech generated');

  return audioData;
}

export const speechGenerator = {
  generateMultiSpeakerSpeechFromChunks
};
