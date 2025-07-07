import path from 'path';
import fs from 'fs/promises';
import process from 'process';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

import { saveCombinedWaveFile } from '../utils/save_wav_file.mjs';
import { generationMeta } from '../utils/generation_meta.mjs';

const OUTPUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../output');

class FileManager {
  constructor() {
    this.currentGenerationNumber = null;
    this.currentGenerationDir = null;
  }

  async initializeGeneration() {
    this.currentGenerationNumber = generationMeta.getNextCounter();
    const dateString = this._getCurrentDateString();
    this.currentGenerationDir = path.join(OUTPUT_PATH, `generation_${this.currentGenerationNumber}_${dateString}`);
    await mkdir(this.currentGenerationDir, { recursive: true });
  }

  async saveTextChunksToFile(textChunks, type) {
    if (!this.currentGenerationNumber) {
      throw new Error('Generation not started. Call initializeGeneration() first.');
    }

    const { filePath, relativeFilePath } = this._getOutputFilePath(type + '_text', 'txt');

    console.log(`\n📝 Saving text to "output/${relativeFilePath}"`);

    const fullText = textChunks.join('\n').trim();
    await fs.writeFile(filePath, fullText, 'utf-8');

    console.log(`✅ Text saved to "output/${relativeFilePath}"`);
  }

  async saveAudioToFile(audioData) {
    if (!this.currentGenerationNumber) {
      throw new Error('Generation not started. Call initializeGeneration() first.');
    }

    const { filePath, relativeFilePath } = this._getOutputFilePath('speech', 'wav');

    console.log(`\n🎵 Saving audio to "output/${relativeFilePath}"`);

    await saveCombinedWaveFile(filePath, audioData);

    console.log(`✅ Audio saved to "output/${relativeFilePath}"`);
  }

  async saveWordDefinitionsToCSVFile(wordsData) {
    if (!this.currentGenerationNumber) {
      throw new Error('Generation not started. Call initializeGeneration() first.');
    }

    const { filePath, relativeFilePath } = this._getOutputFilePath('word_definitions', 'csv');

    console.log(`\n📝 Saving word definitions table to "output/${relativeFilePath}"`);

    const csvHeader = [
      'ID',
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
        `"${entry.id + 1}"`,
        `"${entry.word}"`,
        `"${entry.forms}"`,
        `"${entry.part_of_speech}"`,
        `"${entry.regularity}"`,
        `"${translations}"`,
        `"${entry.example}"`
      ].join(',');
    }).join('\n');

    await fs.writeFile(filePath, csvHeader + csvRows);

    console.log(`✅ Word definitions table saved to "output/${relativeFilePath}"`);
  }

  _getOutputFilePath(prefix, extension) {
    if (!this.currentGenerationDir) {
      throw new Error('Generation directory not set. Call initializeGeneration() first.');
    }

    const dateString = this._getCurrentDateString();
    const fileName = `${prefix}_${dateString}.${extension}`;
    const filePath = path.join(this.currentGenerationDir, fileName);
    const relativeFilePath = path.relative(process.cwd(), filePath).replace(/^output\//, '');

    return { filePath, relativeFilePath };
  }

  _getCurrentDateString() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  completeGeneration() {
    if (!this.currentGenerationNumber) {
      throw new Error('No active generation to finish.');
    }

    generationMeta.updateGenerationMeta();
    this.currentGenerationNumber = null;
    this.currentGenerationDir = null;
  }
}

export const fileManager = new FileManager();
