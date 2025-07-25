import { WordEntryModel } from '../models/WordEntryModel';
import { WordEntryDocument } from '../types';
import { WordEntry } from '../../../types/wordEntry';
import { logger } from '../../logger';

export class WordEntryRepository {
  async create(wordEntry: WordEntry): Promise<WordEntryDocument> {
    try {
      const newEntry = new WordEntryModel(wordEntry);
      const savedEntry = await newEntry.save();
      logger.success(`✅ Word entry created: ${savedEntry.word}`);
      return savedEntry;
    } catch (error) {
      logger.error('❌ Error creating word entry:', error);
      throw error;
    }
  }

  async createMany(wordEntries: WordEntry[]): Promise<WordEntryDocument[]> {
    try {
      const savedEntries = await WordEntryModel.insertMany(wordEntries);
      logger.success(`✅ Created ${savedEntries.length} word entries`);
      return savedEntries;
    } catch (error) {
      logger.error('❌ Error creating multiple word entries:', error);
      throw error;
    }
  }

  async findByWord(word: string): Promise<WordEntryDocument | null> {
    try {
      return await WordEntryModel.findOne({ word });
    } catch (error) {
      logger.error('❌ Error finding word entry:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<WordEntryDocument | null> {
    try {
      return await WordEntryModel.findById(id);
    } catch (error) {
      logger.error('❌ Error finding word entry by ID:', error);
      throw error;
    }
  }

  async findAll(): Promise<WordEntryDocument[]> {
    try {
      return await WordEntryModel.find().sort({ word: 1 });
    } catch (error) {
      logger.error('❌ Error finding all word entries:', error);
      throw error;
    }
  }

  async findByPartOfSpeech(partOfSpeech: string): Promise<WordEntryDocument[]> {
    try {
      return await WordEntryModel.find({ 'grammar.partOfSpeech': partOfSpeech }).sort({ word: 1 });
    } catch (error) {
      logger.error('❌ Error finding word entries by part of speech:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<WordEntry>): Promise<WordEntryDocument | null> {
    try {
      const updatedEntry = await WordEntryModel.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      if (updatedEntry) {
        logger.success(`✅ Word entry updated: ${updatedEntry.word}`);
      }
      return updatedEntry;
    } catch (error) {
      logger.error('❌ Error updating word entry:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await WordEntryModel.findByIdAndDelete(id);
      if (result) {
        logger.success(`✅ Word entry deleted: ${result.word}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('❌ Error deleting word entry:', error);
      throw error;
    }
  }

  async deleteAll(): Promise<number> {
    try {
      const result = await WordEntryModel.deleteMany({});
      logger.success(`✅ Deleted ${result.deletedCount} word entries`);
      return result.deletedCount || 0;
    } catch (error) {
      logger.error('❌ Error deleting all word entries:', error);
      throw error;
    }
  }
}

export const wordEntryRepository = new WordEntryRepository();
