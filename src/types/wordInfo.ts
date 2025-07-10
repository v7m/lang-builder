export type WordInfo = {
  word: string | null;
  grammar: Grammar | null;
  forms: WordForms | null;
  translations: Translations | null;
  examples: string[] | null;
};

export type Grammar = {
  partOfSpeech: PartOfSpeech;
  regular: boolean;
  gender: Gender | null;
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
  nominativeSingular: string | null;
  genitiveSingular: string | null;
  nominativePlural: string | null;
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
