import path from 'path';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';

import { generationRegistry, type CounterType } from '@/services/generationRegistry';
import { logger } from '@/services/logger';
import { WordInfo } from '@/types/wordInfo';
import { Nullable } from '@/types';
import { TextSaver } from './savers/TextSaver';
import { CsvSaver } from './savers/CsvSaver';
import { AudioSaver } from './savers/AudioSaver';
import { logAndThrowError } from '@/utils/errors';

const OUTPUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../output');
const TEST_OUTPUT_PATH = path.join(OUTPUT_PATH, 'test');

const GENERATION_ERRORS = {
  NOT_STARTED: 'Generation not started. Call initializeGeneration() first.',
  COMPLETED: 'Generation was completed. Start new generation with initializeGeneration().',
  COUNTER_TYPE_REQUIRED: 'Counter type is required for this operation. Call initializeGeneration() first.',
} as const;

export class FileManager {
  private activeGenerationNumber: Nullable<number> = null;
  private activeGenerationDirPath: Nullable<string> = null;
  private activeCounterType: Nullable<CounterType> = null;
  private isTestGeneration: boolean = false;
  
  private textSaver: TextSaver;
  private csvSaver: CsvSaver;
  private audioSaver: AudioSaver;

  constructor() {
    this.textSaver = new TextSaver();
    this.csvSaver = new CsvSaver();
    this.audioSaver = new AudioSaver();
  }

  async withContentGenerationSession<T>(
    counterType: CounterType,
    callback: (generationType: CounterType) => Promise<T>
  ): Promise<T> {
    await this.initializeGeneration(counterType);

    try {
      const result = await callback(counterType);
      await this.completeGeneration();
      return result;
    } catch (error) {
      this._resetGeneration();
      throw error;
    }
  }

  private async initializeGeneration(counterType: CounterType): Promise<void> {
    if (!counterType) {
      this._throwGenerationCounterTypeRequiredError();
    }

    const meta = await generationRegistry.getRegistry();
    this.activeGenerationNumber = meta.counter[counterType] + 1;
    this.activeCounterType = counterType;
    this.isTestGeneration = counterType === 'test';
    await this._initializeGenerationDir();
  }

  private async completeGeneration(): Promise<void> {
    if (!this.activeCounterType) {
      this._throwGenerationNotStartedError();
    }
    if (!this.activeGenerationNumber) {
      this._throwGenerationCompletedError();
    }

    await generationRegistry.updateRegistry(this.activeCounterType, this.activeGenerationNumber);
    this._resetGeneration();
  }

  async saveTextToFile(text: string, prefix: string): Promise<void> {
    this._validateGenerationState();

    const { filePath, relativeFilePath } = this._buildGenerationFilePath(prefix, 'txt');
    await this.textSaver.save(filePath, text);
    logger.success(`💾 Text saved to "output/${relativeFilePath}"`, { indent: 1 });
  }

  async saveWordInfosToCSVFile(wordInfos: WordInfo[]): Promise<void> {
    this._validateGenerationState();

    const { filePath, relativeFilePath } = this._buildGenerationFilePath('word_info', 'csv');
    await this.csvSaver.save(filePath, wordInfos);
    logger.success(`💾 CSV file saved to "output/${relativeFilePath}"`, { indent: 1 });
  }

  async saveAudioToFile(audioData: Buffer[]): Promise<void> {
    this._validateGenerationState();

    const { filePath, relativeFilePath } = this._buildGenerationFilePath('speech', 'wav');
    await this.audioSaver.save(filePath, audioData);
    logger.success(`💾 Audio saved to "output/${relativeFilePath}"`, { indent: 1 });
  }

  private async _initializeGenerationDir(): Promise<void> {
    await this._buildActiveGenerationDirPath();
    await mkdir(this.activeGenerationDirPath!, { recursive: true });
  }

  private async _buildActiveGenerationDirPath(): Promise<void> {
    const dateString = this._getCurrentDateString();
    const generationDirName =
      this.activeCounterType == 'test'
        ? `test_generation_${this.activeGenerationNumber}_${dateString}`
        : `generation_${this.activeGenerationNumber}_${dateString}`;

    const outputPath = this.isTestGeneration ? TEST_OUTPUT_PATH : OUTPUT_PATH;
    this.activeGenerationDirPath = path.join(outputPath, generationDirName);
  }

  private _buildGenerationFilePath(
    prefix: string,
    extension: string,
  ): { filePath: string; relativeFilePath: string } {
    const dateString = this._getCurrentDateString();
    const fileName = `${prefix}_${this.activeGenerationNumber}_${dateString}.${extension}`;
    const filePath = path.join(this.activeGenerationDirPath!, fileName);
    const relativeFilePath = path.relative(process.cwd(), filePath).replace(/^output\//, '');

    return { filePath, relativeFilePath };
  }

  private _validateGenerationState(): void {
    if (!this.activeCounterType) {
      this._throwGenerationNotStartedError();
    }
    if (!this.activeGenerationNumber || !this.activeGenerationDirPath) {
      this._throwGenerationCompletedError();
    }
  }

  private _getCurrentDateString(): string {
    const now = new Date();
    const hours = now.getHours();

    // If time is before 6 AM, use previous day
    const adjustedDate = new Date(now);
    if (hours < 6) {
      adjustedDate.setDate(adjustedDate.getDate() - 1);
    }

    const day = String(adjustedDate.getDate()).padStart(2, '0');
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const year = adjustedDate.getFullYear();

    return `${day}.${month}.${year}`;
  }

  private _resetGeneration(): void {
    this.activeGenerationNumber = null;
    this.activeGenerationDirPath = null;
    this.activeCounterType = null;
    this.isTestGeneration = false;
  }

  private _throwGenerationNotStartedError(): never {
    logAndThrowError(
      GENERATION_ERRORS.NOT_STARTED,
      new Error(GENERATION_ERRORS.NOT_STARTED)
    );
  }

  private _throwGenerationCompletedError(): never {
    logAndThrowError(
      GENERATION_ERRORS.COMPLETED,
      new Error(GENERATION_ERRORS.COMPLETED)
    );
  }

  private _throwGenerationCounterTypeRequiredError(): never {
    logAndThrowError(
      GENERATION_ERRORS.COUNTER_TYPE_REQUIRED,
      new Error(GENERATION_ERRORS.COUNTER_TYPE_REQUIRED)
    );
  }
}
