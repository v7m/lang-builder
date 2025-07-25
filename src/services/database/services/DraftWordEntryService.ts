import { DraftWordEntryRepository } from '../repositories/DraftWordEntryRepository';
import { WordEntryDocument } from '../types';
import { WordEntry } from '../../../types/wordEntry';
import { logger } from '../../logger';

export class DraftWordEntryService {
  private repository: DraftWordEntryRepository;

  constructor() {
    this.repository = new DraftWordEntryRepository();
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
      logger.error('❌ Error creating draft word entry:', error);
      throw error;
    }
  }

  async createMany(wordEntries: WordEntry[]): Promise<WordEntryDocument[]> {
    try {
      const validatedEntries = this.validateAndNormalizeMany(wordEntries);
      return await this.repository.createMany(validatedEntries);
    } catch (error) {
      logger.error('❌ Error creating multiple draft word entries:', error);
      throw error;
    }
  }

  async findByWord(word: string): Promise<WordEntryDocument | null> {
    try {
      return await this.repository.findByWord(word);
    } catch (error) {
      logger.error('❌ Error finding draft word entry:', error);
      throw error;
    }
  }

  async findAll(): Promise<WordEntryDocument[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      logger.error('❌ Error finding all draft word entries:', error);
      throw error;
    }
  }

  async findByPartOfSpeech(partOfSpeech: string): Promise<WordEntryDocument[]> {
    try {
      return await this.repository.findByPartOfSpeech(partOfSpeech);
    } catch (error) {
      logger.error('❌ Error finding draft word entries by part of speech:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<WordEntry>): Promise<WordEntryDocument | null> {
    try {
      const validatedUpdates = this.validateAndNormalize(updates as WordEntry);
      return await this.repository.update(id, validatedUpdates);
    } catch (error) {
      logger.error('❌ Error updating draft word entry:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      logger.error('❌ Error deleting draft word entry:', error);
      throw error;
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return await this.repository.deleteAll();
    } catch (error) {
      logger.error('❌ Error deleting all draft word entries:', error);
      throw error;
    }
  }

  async getStats(): Promise<{
    total: number;
    byPartOfSpeech: Record<string, number>;
  }> {
    try {
      const allEntries = await this.findAll();
      const total = allEntries.length;
      const byPartOfSpeech: Record<string, number> = {};

      allEntries.forEach(entry => {
        const pos = entry.grammar?.partOfSpeech;
        if (pos) {
          byPartOfSpeech[pos] = (byPartOfSpeech[pos] || 0) + 1;
        }
      });

      return { total, byPartOfSpeech };
    } catch (error) {
      logger.error('❌ Error getting draft word entry stats:', error);
      throw error;
    }
  }

  async promoteToMain(id: string): Promise<WordEntryDocument | null> {
    try {
      console.log('PromoteToMain called with ID:', id);
      
      const draftEntry = await this.repository.findById(id);
      console.log('Found draft entry:', draftEntry);
      
      if (!draftEntry) {
        console.log('No draft entry found for ID:', id);
        return null;
      }

      const { wordEntryService } = await import('./WordEntryService');

      const mainEntry = await wordEntryService.create({
        word: draftEntry.word,
        grammar: draftEntry.grammar,
        forms: draftEntry.forms,
        translations: draftEntry.translations,
        examples: draftEntry.examples
      });
      console.log('Created main entry:', mainEntry);

      const deleted = await this.delete(id);
      console.log('Deleted from draft:', deleted);

      logger.success(`✅ Word "${draftEntry.word}" promoted from draft to main collection`);
      
      return mainEntry;
    } catch (error) {
      console.error('Error in promoteToMain:', error);
      logger.error('❌ Error promoting draft word entry to main:', error);
      throw error;
    }
  }
}

export const draftWordEntryService = new DraftWordEntryService();
