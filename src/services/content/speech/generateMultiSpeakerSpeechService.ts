import pLimit from 'p-limit';

import { Gemini } from '@/services/ai-providers/gemini';
import { promptsProvider } from '@/services/prompts';
import { logger } from '@/services/logger';

const SPEECH_REQUESTS_LIMIT = pLimit(3);
const GEMINI_FEMALE_VOICE = [
  "Achernar",
  "Aoede",
  "Autonoe",
  "Callirrhoe",
  "Despina",
  "Erinome",
  "Gacrux",
  "Kore",
  "Laomedeia",
  "Leda",
  "Pulcherrima",
  "Sulafat",
  "Vindemiatrix",
  "Zephyr"
];

const GEMINI_MALE_VOICE = [
  "Achird",
  "Algenib",
  "Algieba",
  "Alnilam",
  "Charon",
  "Enceladus",
  "Fenrir",
  "Iapetus",
  "Orus",
  "Puck",
  "Rasalgethi",
  "Sadachbia",
  "Sadaltager",
  "Schedar",
  "Umbriel",
  "Zubenelgenubi"
];

async function perform(textChunks: string[]): Promise<Buffer[]> {
  logger.info('Starting speech generation...');

  const speechInstructions = await promptsProvider.getSpeechInstructions();

  const bufferPromises = textChunks.map((chunk, index) =>
    SPEECH_REQUESTS_LIMIT(() => {
      logger.info(`Processing part ${index + 1} (${chunk.length} characters)...`, { indent: 1 });

      const textWithInstruction = `${speechInstructions.trim()}\n${chunk}`;
      const femaleVoice = getRandomVoice(GEMINI_FEMALE_VOICE);
      const maleVoice = getRandomVoice(GEMINI_MALE_VOICE);

      return Gemini.generateSpeechService.perform({
        prompt: textWithInstruction,
        generationConfig: Gemini.configs.multiSpeaker(femaleVoice, maleVoice)
      });
    })
  );
  
  const audioData = await Promise.all(bufferPromises);

  logger.success('Speech generation completed', { indent: 1 });

  return audioData;
}

const getRandomVoice = (voices: string[]): string => {
  return voices[Math.floor(Math.random() * voices.length)];
}

export const generateMultiSpeakerSpeechService = {
  perform
};
