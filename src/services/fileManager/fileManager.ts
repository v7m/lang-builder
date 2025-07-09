import path from 'path';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { generationMeta } from '../../utils/generationMeta';
import { logger } from '../logger';
import { WordInfo } from '../../types/wordInfo';
import { TextSaver } from './savers/textSaver';
import { CsvSaver } from './savers/csvSaver';
import { AudioSaver } from './savers/audioSaver';

const OUTPUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../output');

const GENERATION_NOT_STARTED_ERROR_MESSAGE = 'Generation not started. Call initializeGeneration() first.';
const NO_ACTIVE_GENERATION_ERROR_MESSAGE = 'No active generation found.';

export class FileManager {
  private currentGenerationNumber: number | null = null;
  private currentGenerationDir: string | null = null;
  
  private textSaver: TextSaver;
  private csvSaver: CsvSaver;
  private audioSaver: AudioSaver;

  constructor() {
    this.textSaver = new TextSaver();
    this.csvSaver = new CsvSaver();
    this.audioSaver = new AudioSaver();
  }

  async initializeGeneration(): Promise<void> {
    await this._incrementGenerationCounter();
    await this._initializeCurrentGenerationDir();
  }

  async completeGeneration(): Promise<void> {
    if (!this.currentGenerationNumber) {
      this._throwNoActiveGenerationError();
    }

    await generationMeta.saveMeta({
      counter: this.currentGenerationNumber!,
      lastGenerated: new Date().toISOString()
    });

    this.currentGenerationNumber = null;
    this.currentGenerationDir = null;
  }

  async saveTextChunksToFile(textChunks: string[], prefix: string): Promise<void> {
    const { filePath, relativeFilePath } = this._getOutputFilePath(prefix, 'txt');
    await this.textSaver.save(filePath, textChunks);
    logger.info(`💾 Text saved to "output/${relativeFilePath}"`, { indent: 1 });
  }

  async saveWordInfosToCSVFile(wordInfos: WordInfo[]): Promise<void> {
    const { filePath, relativeFilePath } = this._getOutputFilePath('word_info', 'csv');
    await this.csvSaver.save(filePath, wordInfos);
    logger.success(`💾 CSV file saved to "output/${relativeFilePath}"`, { indent: 1 });
  }

  async saveAudioToFile(audioData: Buffer[]): Promise<void> {
    const { filePath, relativeFilePath } = this._getOutputFilePath('speech', 'wav');
    await this.audioSaver.save(filePath, audioData);
    logger.info(`💾 Audio saved to "output/${relativeFilePath}"`, { indent: 1 });
  }

  private async _initializeCurrentGenerationDir(): Promise<void> {
    await this._setCurrentGenerationDirPath();
    await mkdir(this.currentGenerationDir!, { recursive: true });
  }

  private async _setCurrentGenerationDirPath(): Promise<void> {
    const dateString = this._getCurrentDateString();
    const generationDirName = `generation_${this.currentGenerationNumber}_${dateString}`;
    this.currentGenerationDir = path.join(OUTPUT_PATH, generationDirName);
  }

  private async _incrementGenerationCounter(): Promise<void> {
    this.currentGenerationNumber = await generationMeta.incrementGenerationCounter();
  }

  private _getOutputFilePath(prefix: string, extension: string): { filePath: string; relativeFilePath: string } {
    if (!this.currentGenerationNumber || !this.currentGenerationDir) {
      this._throwGenerationNotStartedError();
    }

    const dateString = this._getCurrentDateString();
    const fileName = `${prefix}_${this.currentGenerationNumber}_${dateString}.${extension}`;
    const filePath = path.join(this.currentGenerationDir!, fileName);
    const relativeFilePath = path.relative(process.cwd(), filePath).replace(/^output\//, '');

    return { filePath, relativeFilePath };
  }

  private _getCurrentDateString(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    return `${day}.${month}.${year}`;
  }

  private _throwGenerationNotStartedError(): never {
    logger.error(GENERATION_NOT_STARTED_ERROR_MESSAGE);
    throw new Error(GENERATION_NOT_STARTED_ERROR_MESSAGE);
  }

  private _throwNoActiveGenerationError(): never {
    logger.error(NO_ACTIVE_GENERATION_ERROR_MESSAGE);
    throw new Error(NO_ACTIVE_GENERATION_ERROR_MESSAGE);
  }
} 