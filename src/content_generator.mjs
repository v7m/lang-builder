import { textGenerator } from './services/textGenerator.mjs';
import { speechGenerator } from './services/speechGenerator.mjs';
import { fileManager } from './services/fileManager.mjs';
import { convertDialogDataToChunks } from './utils/convert_dialog_data_to_chunks.mjs';
import { dictionaryService } from './services/dictionaryService.mjs';
import * as promptsProvider from './utils/prompts_provider.mjs';

const TEXT_CHUNK_LENGTH_LIMIT = 1500;
const DIALOG_LINES_COUNT = 100;

export async function generateDialogTextAndSpeech() {
  const inputWords = promptsProvider.getInputWords();
  const textData = await textGenerator.generateDialog(inputWords, DIALOG_LINES_COUNT);

  const textChunks = convertDialogDataToChunks(textData, TEXT_CHUNK_LENGTH_LIMIT);
  const audioData = await speechGenerator.generateMultiSpeakerSpeechFromChunks(textChunks);

  await fileManager.saveTextChunksToFile(textChunks, 'dialog');
  await fileManager.saveAudioToFile(audioData);
}

export async function generateWordDefinitions() {
  const inputWords = promptsProvider.getInputWords();
  console.log('inputWords', inputWords);
  const wordDefinitions = await dictionaryService.generateWordDefinitions(inputWords);

  await fileManager.saveWordDefinitionsToCSVFile(wordDefinitions);
}

export async function generateMonologueTextAndSpeech() {
  throw new Error('Not implemented yet');
}
