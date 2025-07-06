import { fileURLToPath } from 'url';
import pLimit from 'p-limit';
import path from 'path';
import fs from 'fs/promises';

import { generateText } from './services/openai/text_generator.mjs';
import { splitDialog } from './utils/split_dialog.mjs';
import { generateSpeech } from './services/gemini/speech_generator.mjs';
import { saveCombinedWaveFile } from './utils/save_wav_file.mjs';
import { getOutputFilePath } from './utils/get_output_file_path.mjs';
import { getNextCounter, updateGenerationMeta } from './utils/generation_meta.mjs';
import { 
  getDialogPrompt, 
  getMonologuePrompt,
  getSystemPrompt, 
  getSpeechInstructions 
} from './utils/prompts_provider.mjs';

const TEXT_PART_LENGTH_LIMIT = 1500;
const SPEECH_REQUESTS_LIMIT = pLimit(3);
const OUTPUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../output');

export async function generateDialogTextAndSpeech() {
  const text = await fetchDialogText();
  const audioData = await fetchSpeech(text);
  
  await saveTextToFile(text, 'dialog');
  await saveSpeechToFile(audioData);
}

export async function generateMonologueTextAndSpeech() {
  const text = await fetchMonologueText();
  const audioData = await fetchSpeech(text);

  await saveTextToFile(text, 'monologue');
  await saveSpeechToFile(audioData);
}

async function fetchDialogText() {
  console.log('📤 Fetching dialog text from AI started');
  
  const prompt = getDialogPrompt(); 
  const systemPrompt = getSystemPrompt();
  const text = await generateText(prompt, systemPrompt);

  logGeneratedText(text);

  return text;
}

async function fetchMonologueText() {
  console.log('📤 Fetching monologue text from AI started');
  
  const prompt = getMonologuePrompt(); 
  const systemPrompt = getSystemPrompt();
  const text = await generateText(prompt, systemPrompt);

  logGeneratedText(text);

  return text;
}

async function fetchSpeech(text) {
  console.log('\n🎙️ Fetching speech from AI started');

  const textParts = splitDialog(text, TEXT_PART_LENGTH_LIMIT);
  const speechInstructions = getSpeechInstructions();

  const bufferPromises = textParts.map((part, index) =>
    SPEECH_REQUESTS_LIMIT(() => {
      console.log(`\n🎙️ Fetching speech for text part #${index + 1}...`);
      console.log(`Text part length: ${part.length}`);
      console.log(`${part} \n`);

      return generateSpeech(part, speechInstructions);
    })
  );
  
  const audioData = await Promise.all(bufferPromises);

  console.log('\n🎙️ Speech fetched');
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

function logGeneratedText(text) {
  console.log('\n📝 Text fetched:\n');
  console.log(text);
  console.log('\nText length:\n');
  console.log(text.length);
}

async function saveTextToFile(text, type) {
  const nextCounter = getNextCounter();
  const fileName = `Text_${nextCounter}_${type}.txt`;
  const filePath = path.join(OUTPUT_PATH, fileName);
  const relativePath = path.relative(process.cwd(), filePath).replace(/^output\//, '');

  console.log(`\n📝 Saving text to "output/${relativePath}"`);
  
  await fs.writeFile(filePath, text, 'utf-8');
  
  console.log(`✅ Text saved to "output/${relativePath}"`);
}
