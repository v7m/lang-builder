import { textGenerator } from './services/textGenerator.mjs';
import { speechGenerator } from './services/speechGenerator.mjs';
import { fileManager } from './services/fileManager.mjs';
import { convertDialogDataToChunks } from './utils/convert_dialog_data_to_chunks.mjs';
import { dictionaryService } from './services/dictionaryService.mjs';
import * as promptsProvider from './utils/prompts_provider.mjs';

const TEXT_CHUNK_LENGTH_LIMIT = 1500;
const DIALOG_LINES_COUNT = 100;

async function generateLearningContent() {
  await fileManager.initializeGeneration();

  console.log('🚀 Starting learning content generation...');

  try {
    return generateAndSaveWordDefinitions(promptsProvider.getInputWords())
      .then(generateAndSaveText)
      .then(generateAndSaveSpeech)
      .then(() => {
        fileManager.completeGeneration();

        console.log('🎉 Learning content generation completed!');
      });
  } catch (error) {
    console.error('❌ Error during content generation:', error);
    throw error;
  }
}

async function generateAndSaveWordDefinitions(inputWords) {
  const wordDefinitions = await dictionaryService.generateWordDefinitions(inputWords);
  await fileManager.saveWordDefinitionsToCSVFile(wordDefinitions);

  return wordDefinitions;
}

async function generateAndSaveText(wordDefinitions) {
  const wordForms = wordDefinitions.words_data.map(word => word.forms);
  const textData = await textGenerator.generateDialog(wordForms, DIALOG_LINES_COUNT);
  const textChunks = convertDialogDataToChunks(textData, TEXT_CHUNK_LENGTH_LIMIT);
  await fileManager.saveTextChunksToFile(textChunks, 'dialog');

  return textChunks;
}

async function generateAndSaveSpeech(textChunks) {
  const audioData = await speechGenerator.generateMultiSpeakerSpeechFromChunks(textChunks);
  await fileManager.saveAudioToFile(audioData);

  return audioData;
}

export const contentGenerator = {
  generateLearningContent,
}; 
