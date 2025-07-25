import { DraftWordEntryModel } from '../models/DraftWordEntryModel';
import { WordEntryDocument } from '../types';
import { WordEntry } from '../../../types/wordEntry';
import { logger } from '../../logger';

export class DraftWordEntryRepository {
  async create(wordEntry: WordEntry): Promise<WordEntryDocument> {
    try {
      const newEntry = new DraftWordEntryModel(wordEntry);
      return await newEntry.save();
    } catch (error) {
      logger.error('❌ Error creating draft word entry in repository:', error);
      throw error;
    }
  }

  async createMany(wordEntries: WordEntry[]): Promise<WordEntryDocument[]> {
    try {
      return await DraftWordEntryModel.insertMany(wordEntries);
    } catch (error) {
      logger.error('❌ Error creating multiple draft word entries in repository:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<WordEntryDocument | null> {
    try {
      return await DraftWordEntryModel.findById(id);
    } catch (error) {
      logger.error('❌ Error finding draft word entry by ID in repository:', error);
      throw error;
    }
  }

  async findByWord(word: string): Promise<WordEntryDocument | null> {
    try {
      return await DraftWordEntryModel.findOne({ word });
    } catch (error) {
      logger.error('❌ Error finding draft word entry by word in repository:', error);
      throw error;
    }
  }

  async findAll(): Promise<WordEntryDocument[]> {
    try {
      return await DraftWordEntryModel.find().sort({ createdAt: -1 });
    } catch (error) {
      logger.error('❌ Error finding all draft word entries in repository:', error);
      throw error;
    }
  }

  async findByPartOfSpeech(partOfSpeech: string): Promise<WordEntryDocument[]> {
    try {
      return await DraftWordEntryModel.find({ 'grammar.partOfSpeech': partOfSpeech });
    } catch (error) {
      logger.error('❌ Error finding draft word entries by part of speech in repository:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<WordEntry>): Promise<WordEntryDocument | null> {
    try {
      return await DraftWordEntryModel.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
    } catch (error) {
      logger.error('❌ Error updating draft word entry in repository:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await DraftWordEntryModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('❌ Error deleting draft word entry in repository:', error);
      throw error;
    }
  }

  async deleteAll(): Promise<number> {
    try {
      const result = await DraftWordEntryModel.deleteMany({});
      return result.deletedCount;
    } catch (error) {
      logger.error('❌ Error deleting all draft word entries in repository:', error);
      throw error;
    }
  }
}

export const draftWordEntryRepository = new DraftWordEntryRepository();
