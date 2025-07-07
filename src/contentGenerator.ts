import { textGenerator } from './services/textGenerator';
import { speechGenerator } from './services/speechGenerator';
import { fileManager } from './services/fileManager';
import { convertDialogDataToChunks } from './utils/convertDialogDataToChunks';
import { dictionaryService } from './services/dictionaryService';
import * as promptsProvider from './utils/promptsProvider';
import { WordData } from './types';

const TEXT_CHUNK_LENGTH_LIMIT = 1500;
const DIALOG_LINES_COUNT = 100;

async function generateLearningContent(): Promise<void> {
  await fileManager.initializeGeneration();

  console.log('🚀 🚀 🚀 STARTING CONTENT GENERATION PROCESS 🚀 🚀 🚀');

  try {
    const inputWords = await promptsProvider.getInputWords();
    return generateAndSaveWordDefinitions(inputWords)
      .then(generateAndSaveText)
      .then(generateAndSaveSpeech)
      .then(() => {
        fileManager.completeGeneration();

        console.log('\n🎉 🎉 🎉 LEARNING CONTENT GENERATION COMPLETED 🎉 🎉 🎉');
      });
  } catch (error) {
    console.error('\n❌ Error during content generation:', error);
    throw error;
  }
}

async function generateAndSaveWordDefinitions(inputWords: string[]): Promise<{ words_data: WordData[] }> {
  const wordDefinitions = await dictionaryService.generateWordDefinitions(inputWords);
  await fileManager.saveWordDefinitionsToCSVFile(wordDefinitions);

  return wordDefinitions;
}

async function generateAndSaveText(wordDefinitions: { words_data: WordData[] }): Promise<string[]> {
  const wordForms = wordDefinitions.words_data.map(word => word.forms).flat();
  const textData = await textGenerator.generateDialog(wordForms, DIALOG_LINES_COUNT);
  const textChunks = convertDialogDataToChunks(textData, TEXT_CHUNK_LENGTH_LIMIT);
  await fileManager.saveTextChunksToFile(textChunks, 'dialog');

  return textChunks;
}

async function generateAndSaveSpeech(textChunks: string[]): Promise<Buffer[]> {
  const audioData = await speechGenerator.generateMultiSpeakerSpeechFromChunks(textChunks);
  await fileManager.saveAudioToFile(audioData);

  return audioData;
}

export const contentGenerator = {
  generateLearningContent,
};
