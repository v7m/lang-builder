import path from 'path';
import fs from 'fs/promises';
import process from 'process';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';
import { WordData } from '../types';

import { saveCombinedWaveFile } from '../utils/saveWavFile';
import { generationMeta } from '../utils/generationMeta';

const OUTPUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../output');

class FileManager {
  private currentGenerationNumber: number | null;
  private currentGenerationDir: string | null;

  constructor() {
    this.currentGenerationNumber = null;
    this.currentGenerationDir = null;
  }

  async initializeGeneration(): Promise<void> {
    this.currentGenerationNumber = await generationMeta.incrementGenerationCounter();
    const dateString = this._getCurrentDateString();
    this.currentGenerationDir = path.join(OUTPUT_PATH, `generation_${this.currentGenerationNumber}_${dateString}`);
    await mkdir(this.currentGenerationDir, { recursive: true });
  }

  async saveTextChunksToFile(textChunks: string[], type: string): Promise<void> {
    if (!this.currentGenerationNumber) {
      throw new Error('Generation not started. Call initializeGeneration() first.');
    }

    const { filePath, relativeFilePath } = this._getOutputFilePath(type + '_text', 'txt');

    console.log(`    💾 Saving text to "${relativeFilePath}"`);

    const fullText = textChunks.join('\n').trim();
    await fs.writeFile(filePath, fullText, 'utf-8');

    console.log(`    ✅ Text saved to "output/${relativeFilePath}"`);
  }

  async saveAudioToFile(audioData: Buffer[]): Promise<void> {
    if (!this.currentGenerationNumber) {
      throw new Error('Generation not started. Call initializeGeneration() first.');
    }

    const { filePath, relativeFilePath } = this._getOutputFilePath('speech', 'wav');

    console.log(`    💾 Saving audio to "output/${relativeFilePath}"`);

    await saveCombinedWaveFile(filePath, audioData);

    console.log(`    ✅ Audio saved to "output/${relativeFilePath}"`);
  }

  async saveWordDefinitionsToCSVFile(wordsData: { words_data: WordData[] }): Promise<void> {
    if (!this.currentGenerationNumber) {
      throw new Error('Generation not started. Call initializeGeneration() first.');
    }

    const { filePath, relativeFilePath } = this._getOutputFilePath('word_definitions', 'csv');

    console.log(`    💾 Saving word definitions to "output/${relativeFilePath}"`);

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

    console.log(`    ✅ Word definitions saved to "output/${relativeFilePath}"`);
  }

  private _getOutputFilePath(prefix: string, extension: string): { filePath: string; relativeFilePath: string } {
    if (!this.currentGenerationDir) {
      throw new Error('Generation directory not set. Call initializeGeneration() first.');
    }

    const dateString = this._getCurrentDateString();
    const fileName = `${prefix}_${dateString}.${extension}`;
    const filePath = path.join(this.currentGenerationDir, fileName);
    const relativeFilePath = path.relative(process.cwd(), filePath).replace(/^output\//, '');

    return { filePath, relativeFilePath };
  }

  private _getCurrentDateString(): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  async completeGeneration(): Promise<void> {
    if (!this.currentGenerationNumber) {
      throw new Error('No active generation to finish.');
    }

    await generationMeta.saveMeta({
      counter: this.currentGenerationNumber,
      lastGenerated: new Date().toISOString()
    });

    this.currentGenerationNumber = null;
    this.currentGenerationDir = null;
  }
}

export const fileManager = new FileManager();
