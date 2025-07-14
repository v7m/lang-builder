import { fileManager } from '@/services/fileManager';
import { generateDialogService } from '@/services/content/texts/generateDialogService';
import { generateMultiSpeakerSpeechService } from '@/services/content/speeches/generateMultiSpeakerSpeechService';
import { inputService } from '@/services/input';
import { convertDialogDataToChunks, TEXT_CHUNK_LENGTH_LIMIT } from '@/utils/convertDialogDataToChunks';
import { fetchWordEntriesService } from '@/services/content/wordEntries/fetchWordEntriesService';
import { WordEntry } from '@/types/wordEntry';
import { WordFormsPresenter } from '@/utils/WordFormsPresenter';
import { logger } from '@/services/logger';
import { logAndThrowError } from '@/utils/errors';
import { CounterType, generationRegistry } from './services/generationRegistry';

const MIN_DIALOG_LINES_COUNT = 120;

export async function generateTextAndSpeech(): Promise<void> {
  logger.info('🚀 🚀 🚀 STARTING TEXT AND SPEECH GENERATION PROCESS 🚀 🚀 🚀');

  try {
    await fileManager.withContentGenerationSession('main', async (generationType) => {
      return inputService.getInputWords()
        .then(wordForms => {
          logger.debug('wordForms: ', wordForms);
          return generateText(wordForms, generationType);
        })
        .then(textChunks => {
          logger.debug('textChunks: ', textChunks);
          return generateSpeech(textChunks);
        })
        .then(() => {
          logger.success('🎉 🎉 🎉 TEXT AND SPEECH GENERATION COMPLETED 🎉 🎉 🎉', { indent: 1 });
        });
    });

    logger.success('🎉 🎉 🎉 TEXT AND SPEECH GENERATION COMPLETED 🎉 🎉 🎉');
  } catch (error) {
    logAndThrowError('❌ Error during text and speech generation', error as Error);
  }
}

export async function testGenerate(): Promise<void> {
  logger.info('🚀 🚀 🚀 STARTING TEST GENERATION PROCESS 🚀 🚀 🚀');

  try {
    await fileManager.withContentGenerationSession('test', async (generationType) => {
      return inputService.getInputWords()
        .then(inputWords => {
          logger.debug('inputWords: ', inputWords);
          return fetchWordEntries(inputWords);
        })
        .then(wordEntries => {
          logger.debug('wordEntries: ', wordEntries);
          return extractWordForms(wordEntries);
        })
        .then(wordForms => {
          logger.debug('wordForms: ', wordForms);
          return generateText(wordForms, generationType);
        })
        .then(textChunks => {
          logger.debug('textChunks: ', textChunks);
          return generateSpeech(textChunks);
        });
    }).then(() => {
      logger.success('🎉 🎉 🎉 TEST GENERATION COMPLETED 🎉 🎉 🎉');
    });
  } catch (error) {
    logAndThrowError('❌ Error during text and speech generation', error as Error);
  }
}

async function fetchWordEntries(inputWords: string[]): Promise<WordEntry[]> {
  const wordEntries = await fetchWordEntriesService.perform(inputWords);
  await fileManager.saveWordEntriesToCSVFile(wordEntries);

  return wordEntries;
}

function extractWordForms(wordEntries: WordEntry[]): string[] {
  return wordEntries.map(wordEntry =>
    new WordFormsPresenter(wordEntry).toString()
  ).flat();
}

async function generateText(wordForms: string[], counterType: CounterType): Promise<string[]> {
  logger.debug(`wordForms: ${wordForms.length}`, { indent: 1 });

  const speechNumber = await generationRegistry.getCounter(counterType) + 1;
  const textData = await generateDialogService.perform(wordForms, MIN_DIALOG_LINES_COUNT, speechNumber);
  const textChunks = convertDialogDataToChunks(textData, TEXT_CHUNK_LENGTH_LIMIT);
  const text = textChunks.join('\n\n');
  await fileManager.saveTextToFile(text, 'dialog');

  return textChunks;
}

async function generateSpeech(textChunks: string[]): Promise<Buffer[]> {
  const audioData = await generateMultiSpeakerSpeechService.perform(textChunks);
  await fileManager.saveAudioToFile(audioData);

  return audioData;
}

export const contentGenerator = {
  generateTextAndSpeech,
  testGenerate,
};
