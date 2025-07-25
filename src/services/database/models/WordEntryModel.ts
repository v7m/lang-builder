import { Schema, model as mongooseModel } from 'mongoose';
import { WordEntryDocument } from '../types';
import { GrammarSchema, WordFormsSchema, TranslationsSchema } from './sharedWordEntries';

const WordEntrySchema = new Schema<WordEntryDocument>({
  word: {
    type: String,
    required: true
  },
  grammar: {
    type: GrammarSchema,
    required: true
  },
  forms: {
    type: WordFormsSchema,
    required: false
  },
  translations: {
    type: TranslationsSchema,
    required: false
  },
  examples: [{
    type: String
  }]
}, {
  timestamps: true,
  collection: 'de_word_entries'
});

// Indexes for optimization
WordEntrySchema.index({ word: 1 });
WordEntrySchema.index({ 'grammar.partOfSpeech': 1 });
WordEntrySchema.index({ 'grammar.gender': 1 });

// Create model with Next.js hot reload compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let WordEntryModel: any;

try {
  // Try to get existing model first
  WordEntryModel = mongooseModel('WordEntry');
} catch {
  // If model doesn't exist, create it
  WordEntryModel = mongooseModel('WordEntry', WordEntrySchema);
}

export { WordEntryModel };
