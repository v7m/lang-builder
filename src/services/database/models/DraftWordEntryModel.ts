import { Schema, model as mongooseModel } from 'mongoose';
import { WordEntryDocument } from '../types';
import { GrammarSchema, WordFormsSchema, TranslationsSchema } from './sharedWordEntries';

const DraftWordEntrySchema = new Schema<WordEntryDocument>({
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
  collection: 'de_draft_word_entries'
});

// Indexes for optimization
DraftWordEntrySchema.index({ word: 1 });
DraftWordEntrySchema.index({ 'grammar.partOfSpeech': 1 });
DraftWordEntrySchema.index({ 'grammar.gender': 1 });

// Create model with Next.js hot reload compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let DraftWordEntryModel: any;

try {
  // Try to get existing draft model first
  DraftWordEntryModel = mongooseModel('DraftWordEntry');
} catch {
  // If model doesn't exist, create it
  DraftWordEntryModel = mongooseModel('DraftWordEntry', DraftWordEntrySchema);
}

export { DraftWordEntryModel };
