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
  | "particle"
  | "conjunction"
  | "interjection"
  | "numeral"
  | "article"
  | "unknown";

export type WordForms =
  | VerbForms
  | NounForms
  | AdjectiveForms
  | AdverbForms
  | BaseForms;

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

export type AdverbForms = AdjectiveForms | BaseForms;

export type BaseForms = {
  base: string;
};
