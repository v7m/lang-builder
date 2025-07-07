import { fileURLToPath } from 'url';
import pLimit from 'p-limit';
import path from 'path';
import fs from 'fs/promises';

import { generateOpenAIResponse } from './services/openai/openaiClient.mjs';
import { convertDialogDataToChunks } from './utils/convert_dialog_data_to_chunks.mjs';
import { generateGeminiResponse } from './services/gemini/geminiClient.mjs';
import { saveCombinedWaveFile } from './utils/save_wav_file.mjs';
import { getOutputFilePath } from './utils/get_output_file_path.mjs';
import { getNextCounter, updateGenerationMeta } from './utils/generation_meta.mjs';
import { DIALOG_FUNCTION_SCHEMA } from './services/openai/function_schemas/dialog.mjs';
import { 
  getDialogPrompt, 
  getMonologuePrompt,
  getSystemPrompt, 
  getSpeechInstructions 
} from './utils/prompts_provider.mjs';

const TEXT_CHUNK_LENGTH_LIMIT = 1500;
const DIALOG_LINES_COUNT = 100;
const SPEECH_REQUESTS_LIMIT = pLimit(3);
const OUTPUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../output');

export async function generateDialogTextAndSpeech() {
  const textData = await generateDialogText();
  const textChunks = convertDialogDataToChunks(textData, TEXT_CHUNK_LENGTH_LIMIT);
  const audioData = await generateSpeech(textChunks);

  await saveTextToFile(textChunks, 'dialog');
  await saveSpeechToFile(audioData);
}

export async function generateMonologueTextAndSpeech() {
  throw new Error('Not implemented yet');
}

async function generateDialogText() {
  console.log('📤 Generating dialog text from AI started');
  
  const prompt = getDialogPrompt(DIALOG_LINES_COUNT);
  const systemPrompt = getSystemPrompt();
  const textData = await generateOpenAIResponse({
    systemPrompt,
    userPrompt: prompt,
    tools: [DIALOG_FUNCTION_SCHEMA],
    tool_choice: "auto",
    max_tokens: 6000
  })

  logGeneratedText(textData);

  return textData;
}

async function generateSpeech(textChunks) {
  console.log('\n🎙️ Generating speech from AI started');

  const speechInstructions = getSpeechInstructions();

  const bufferPromises = textChunks.map((chunk, index) =>
    SPEECH_REQUESTS_LIMIT(() => {
      console.log(`\n🎙️ Generating speech for text chunk #${index + 1}...`);
      console.log(`Text chunk length: ${chunk.length}`);
      console.log(`${chunk} \n`);

      return generateGeminiResponse(chunk, speechInstructions);
    })
  );
  
  const audioData = await Promise.all(bufferPromises);

  console.log('\n🎙️ Speech generated');
  return audioData;
}

async function saveSpeechToFile(audioData) {
  const nextCounter = getNextCounter();
  const outputFilePath = getOutputFilePath(OUTPUT_PATH, nextCounter);
  const relativePath = path.relative(process.cwd(), outputFilePath).replace(/^output\//, '');
  
  console.log(`\n🎙️ Saving speech audio file to "output/${relativePath}"`);

  await saveCombinedWaveFile(outputFilePath, audioData);
  updateGenerationMeta();

  console.log(`✅ Speech audio file saved to "output/${relativePath}"`);

  return outputFilePath;
}

function logGeneratedText(textData) {
  console.log('\n📝 Text data fetched:\n');
  console.log(textData);
  console.log('\nText data length:\n');
  console.log(textData.dialog.length);
}

async function saveTextToFile(textChunks, type) {
  const fullText = textChunks.join('\n').trim();
  const nextCounter = getNextCounter();
  const fileName = `Text_${nextCounter}_${type}.txt`;
  const filePath = path.join(OUTPUT_PATH, fileName);
  const relativePath = path.relative(process.cwd(), filePath).replace(/^output\//, '');

  console.log(`\n📝 Saving text to "output/${relativePath}"`);
  
  await fs.writeFile(filePath, fullText, 'utf-8');
  
  console.log(`✅ Text saved to "output/${relativePath}"`);
}
