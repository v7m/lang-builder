import path from 'path';
import fs from 'fs/promises';
import process from 'process';
import { fileURLToPath } from 'url';

import { saveCombinedWaveFile } from '../utils/save_wav_file.mjs';
import { getOutputFilePath } from '../utils/get_output_file_path.mjs';
import { getNextCounter, updateGenerationMeta } from '../utils/generation_meta.mjs';

const OUTPUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../output');

async function saveTextChunksToFile(textChunks, type) {
  const fullText = textChunks.join('\n').trim();
  const nextCounter = getNextCounter();
  const fileName = `Text_${nextCounter}_${type}.txt`;
  const filePath = path.join(OUTPUT_PATH, fileName);
  const relativePath = path.relative(process.cwd(), filePath).replace(/^output\//, '');

  console.log(`\n📝 Saving text to "output/${relativePath}"`);

  await fs.writeFile(filePath, fullText, 'utf-8');

  console.log(`✅ Text saved to "output/${relativePath}"`);
}

async function saveAudioToFile(audioData) {
  const nextCounter = getNextCounter();
  const filePath = getOutputFilePath(OUTPUT_PATH, nextCounter);
  const relativePath = path.relative(process.cwd(), filePath).replace(/^output\//, '');

  console.log(`\n🎵 Saving audio to "output/${relativePath}"`);

  await saveCombinedWaveFile(filePath, audioData);

  console.log(`✅ Audio saved to "output/${relativePath}"`);

  updateGenerationMeta();
}

async function saveWordDefinitionsToCSVFile(wordsData) {
  const nextCounter = getNextCounter();
  const fileName = `word_definitions_${nextCounter}.csv`;
  const filePath = path.join(OUTPUT_PATH, fileName);
  const relativePath = path.relative(process.cwd(), filePath).replace(/^output\//, '');

  console.log(`\n📝 Saving word definitions table to "output/${relativePath}"`);

  const csvHeader = [
    'Word',
    'Forms',
    'Part of Speech',
    'Regularity',
    'Translations',
    'Example'
  ].join(',') + '\n';

  const csvRows = wordsData.words_data.map(entry => {
    const translations = entry.translation.join('; ');

    return [
      `"${entry.word}"`,
      `"${entry.forms}"`,
      `"${entry.part_of_speech}"`,
      `"${entry.regularity}"`,
      `"${translations}"`,
      `"${entry.example}"`
    ].join(',');
  }).join('\n');

  await fs.writeFile(filePath, csvHeader + csvRows);

  console.log(`✅ Word definitions table saved to "output/${relativePath}"`);
}

export const fileManager = {
  saveTextChunksToFile,
  saveAudioToFile,
  saveWordDefinitionsToCSVFile
};
