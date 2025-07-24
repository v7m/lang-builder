import mongoose, { Schema } from 'mongoose';
import { Grammar, WordForms, Gender, PartOfSpeech, Translations } from '../../../types/wordEntry';
import { createEnumFromType } from '@/utils/typeUtils';
import { WordEntryDocument } from '../types';

const GENDER_VALUES: Gender[] = createEnumFromType<Gender>(['masculine', 'feminine', 'neuter']);
const PART_OF_SPEECH_VALUES: PartOfSpeech[] = createEnumFromType<PartOfSpeech>([
  'verb', 'noun', 'adjective', 'adverb', 'pronoun', 'preposition', 'particle',
  'conjunction', 'interjection', 'numeral', 'article', 'unknown'
]);

const GrammarSchema = new Schema<Grammar>({
  partOfSpeech: {
    type: String,
    enum: PART_OF_SPEECH_VALUES,
    required: true
  },
  regular: {
    type: Boolean,
    required: true
  },
      gender: {
      type: String,
      enum: GENDER_VALUES,
      required: false
    }
}, { _id: false });

const WordFormsSchema = new Schema<WordForms>({
  // For verbs
  infinitive: String,
  present3: String,
  preterite: String,
  perfect: String,
  
  // For nouns
  nominativeSingular: String,
  genitiveSingular: String,
  nominativePlural: String,
  
  // For adjectives and adverbs
  positive: String,
  comparative: String,
  superlative: String,
  
  // For other parts of speech
  base: String
}, { _id: false });

const TranslationsSchema = new Schema<Translations>({
  ru: {
    type: String,
    required: true
  }
}, { _id: false });

const WordEntrySchema = new Schema<WordEntryDocument>({
  word: {
    type: String,
    required: true,
    index: true
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
  collection: 'word_entries'
});

// Indexes for optimization
WordEntrySchema.index({ word: 1 });
WordEntrySchema.index({ 'grammar.partOfSpeech': 1 });
WordEntrySchema.index({ 'grammar.gender': 1 });

export const WordEntryModel = mongoose.model<WordEntryDocument>('WordEntry', WordEntrySchema);
