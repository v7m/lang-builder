import { WordEntryRepository } from '../repositories/WordEntryRepository';
import { WordEntryDocument } from '../types';
import { WordEntry } from '../../../types/wordEntry';
import { logger } from '../../logger';

export class WordEntryService {
  private repository: WordEntryRepository;

  constructor() {
    this.repository = new WordEntryRepository();
  }

  private validateAndNormalize(entry: WordEntry): WordEntry {
    return {
      ...entry,
      translations: entry.translations || { ru: null },
      forms: entry.forms,
      examples: entry.examples || []
    };
  }

  private validateAndNormalizeMany(entries: WordEntry[]): WordEntry[] {
    return entries.map(entry => this.validateAndNormalize(entry));
  }

  async create(wordEntry: WordEntry): Promise<WordEntryDocument> {
    try {
      const validatedEntry = this.validateAndNormalize(wordEntry);
      return await this.repository.create(validatedEntry);
    } catch (error) {
      logger.error('❌ Error creating word entry:', error);
      throw error;
    }
  }

  async createMany(wordEntries: WordEntry[]): Promise<WordEntryDocument[]> {
    try {
      const validatedEntries = this.validateAndNormalizeMany(wordEntries);
      return await this.repository.createMany(validatedEntries);
    } catch (error) {
      logger.error('❌ Error creating multiple word entries:', error);
      throw error;
    }
  }

  async findByWord(word: string): Promise<WordEntryDocument | null> {
    try {
      return await this.repository.findByWord(word);
    } catch (error) {
      logger.error('❌ Error finding word entry:', error);
      throw error;
    }
  }

  async findAll(): Promise<WordEntryDocument[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      logger.error('❌ Error finding all word entries:', error);
      throw error;
    }
  }

  async findByPartOfSpeech(partOfSpeech: string): Promise<WordEntryDocument[]> {
    try {
      return await this.repository.findByPartOfSpeech(partOfSpeech);
    } catch (error) {
      logger.error('❌ Error finding word entries by part of speech:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<WordEntry>): Promise<WordEntryDocument | null> {
    try {
      const validatedUpdates = this.validateAndNormalize(updates as WordEntry);
      return await this.repository.update(id, validatedUpdates);
    } catch (error) {
      logger.error('❌ Error updating word entry:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      logger.error('❌ Error deleting word entry:', error);
      throw error;
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return await this.repository.deleteAll();
    } catch (error) {
      logger.error('❌ Error deleting all word entries:', error);
      throw error;
    }
  }

  async getStats(): Promise<{
    total: number;
    byPartOfSpeech: Record<string, number>;
  }> {
    try {
      return await this.repository.getStats();
    } catch (error) {
      logger.error('❌ Error getting database stats:', error);
      throw error;
    }
  }
}

export const wordEntryService = new WordEntryService();
