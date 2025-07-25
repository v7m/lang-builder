import { Schema } from 'mongoose';
import { Grammar, WordForms, Gender, PartOfSpeech, Translations } from '../../../types/wordEntry';
import { createEnumFromType } from '@/utils/typeUtils';

const GENDER_VALUES: Gender[] = createEnumFromType<Gender>(['masculine', 'feminine', 'neuter']);
const PART_OF_SPEECH_VALUES: PartOfSpeech[] = createEnumFromType<PartOfSpeech>([
  'verb', 'noun', 'adjective', 'adverb', 'pronoun', 'preposition', 'particle',
  'conjunction', 'interjection', 'numeral', 'article', 'unknown'
]);

export const GrammarSchema = new Schema<Grammar>({
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

export const WordFormsSchema = new Schema<WordForms>({
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

export const TranslationsSchema = new Schema<Translations>({
  ru: {
    type: String,
    required: false,
    default: ''
  }
}, { _id: false });
