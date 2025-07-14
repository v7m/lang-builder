import { Nullable } from '@/types';

export type WordEntry = {
  word: Nullable<string>;
  grammar: Nullable<Grammar>;
  forms: Nullable<WordForms>;
  translations: Nullable<Translations>;
  examples: Nullable<string[]>;
};

export type Grammar = {
  partOfSpeech: PartOfSpeech;
  regular: boolean;
  gender: Nullable<Gender>;
};

export type Gender = "masculine" | "feminine" | "neuter";

export type Translations = {
  ru: string;
};

export type PartOfSpeech =
  | "verb"
  | "noun"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "interjection"
  | "numeral"
  | "unknown";

export type WordForms =
  | VerbForms
  | NounForms
  | AdjectiveForms
  | AdverbForms
  | Record<string, string>;

export type VerbForms = {
  infinitive: string;
  present3: string;
  preterite: string;
  perfect: string;
};

export type NounForms = {
  nominativeSingular: Nullable<string>;
  genitiveSingular: Nullable<string>;
  nominativePlural: Nullable<string>;
};

export type AdjectiveForms = {
  positive: string;
  comparative: string;
  superlative: string;
};

export type AdverbForms = {
  positive: string;
  comparative: string;
  superlative: string;
};
