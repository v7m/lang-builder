import { generateDialogService } from './services/texts/generateDialogService';
import { generateMultiSpeakerSpeechService } from './services/speech/generateMultiSpeakerSpeechService';
import { fileManager } from './services/fileManager';
import { convertDialogDataToChunks } from './utils/convertDialogDataToChunks';
import { WordFormsFormatter } from './utils/wordFormsFormatter';
import * as promptsProvider from './utils/promptsProvider';
import { fetchWordInfosService } from './services/wordInfo/fetchWordInfosService';
import { logger } from './services/logger';
import { WordInfo } from './types/wordInfo';

const TEXT_CHUNK_LENGTH_LIMIT = 1500;
const DIALOG_LINES_COUNT = 100;

async function test(): Promise<void> {
  // const inputWords = await promptsProvider.getInputWords();

  const inputWords = ['gehen', 'anfragen', 'Mond', 'Wasserhahn', 'Shorts'];

  const wordInfos = await fetchWordInfosService.process(inputWords);
  logger.info(wordInfos);
}

async function runGeneration(): Promise<void> {
  await fileManager.initializeGeneration();
  logger.info('🚀 🚀 🚀 STARTING CONTENT GENERATION PROCESS 🚀 🚀 🚀');

  try {
    const inputWords = await promptsProvider.getInputWords();
    await generateMaterials(inputWords);

    await fileManager.completeGeneration();
    logger.success('🎉 🎉 🎉 LEARNING CONTENT GENERATION COMPLETED 🎉 🎉 🎉');
  } catch (error) {
    logger.error('❌ Error during content generation:', (error as Error).message);
    throw error;
  }
}

async function generateMaterials(inputWords: string[]): Promise<void> {
  await fetchWordInfos(inputWords)
    .then(generateText)
    .then(generateSpeech);
}

async function fetchWordInfos(inputWords: string[]): Promise<WordInfo[]> {
  const wordInfos = await fetchWordInfosService.process(inputWords);
  await fileManager.saveWordInfosToCSVFile(wordInfos);

  return wordInfos;
}

async function generateText(wordInfos: WordInfo[]): Promise<string[]> {
  const wordForms = wordInfos.map(word => {
    return WordFormsFormatter.toString(word.forms!, word.grammar!.partOfSpeech);
  }).flat();

  logger.debug(wordForms);

  const textData = await generateDialogService.process(wordForms, DIALOG_LINES_COUNT);
  // TODO: move convertDialogDataToChunks call to generateAndSaveSpeech
  const textChunks = convertDialogDataToChunks(textData, TEXT_CHUNK_LENGTH_LIMIT);
  await fileManager.saveTextChunksToFile(textChunks, 'dialog');

  return textChunks;
}

async function generateSpeech(textChunks: string[]): Promise<Buffer[]> {
  const audioData = await generateMultiSpeakerSpeechService.process(textChunks);
  await fileManager.saveAudioToFile(audioData);

  return audioData;
}

export const contentGenerator = {
  runGeneration,
  test,
};
