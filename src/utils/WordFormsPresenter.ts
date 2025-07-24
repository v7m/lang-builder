import { 
  WordForms,
  VerbForms,
  NounForms,
  AdjectiveForms,
  AdverbForms,
  Gender,
  Grammar,
  WordEntry,
  BaseForms,
} from '../types/wordEntry';
import { Nullable } from '../types';

export class WordFormsPresenter {
  private forms: WordForms;
  private grammar: Grammar;

  constructor(wordEntry: WordEntry) {
    this.forms = wordEntry.forms!;
    this.grammar = wordEntry.grammar!;
  }

  toString(): string {
    switch (this.grammar.partOfSpeech) {
      case 'verb':
        return this.verbFormsToString();
      case 'noun':
        return this.nounFormsToString();
      case 'adjective':
        return this.adjectiveFormsToString();
      case 'adverb':
        return this.adverbFormsToString();
      default:
        return this.baseFormsToString();
    }
  }

  private verbFormsToString(): string {
    const forms = this.forms as VerbForms;
    return `${forms.infinitive}; ${forms.present3}; ${forms.preterite}; ${forms.perfect}`;
  }

  private nounFormsToString(): string {
    const forms = this.forms as NounForms;
    const { gender } = this.grammar;
    const article = this.getArticle(gender);

    // only plural
    if (!gender && !forms.nominativeSingular && forms.nominativePlural) {
      return `${article} ${forms.nominativePlural}`;
    }

    // only singular
    if (gender && forms.nominativeSingular && !forms.nominativePlural) {
      return `${article} ${forms.nominativeSingular}`;
    }

    // both singular and plural
    return `${article} ${forms.nominativeSingular}; ${forms.nominativePlural}`;
  }

  private adjectiveFormsToString(): string {
    const forms = this.forms as AdjectiveForms;
    let result = forms.positive;

    if (forms.comparative) {
      result += `; ${forms.comparative}`;
    }

    if (forms.superlative) {
      result += `; ${forms.superlative}`;
    }

    return result;
  }

  private adverbFormsToString(): string {
    const forms = this.forms as AdverbForms;

    if ('base' in forms) {
      return this.baseFormsToString();
    }

    return this.adjectiveFormsToString();
  }

  private baseFormsToString(): string {
    const forms = this.forms as BaseForms;

    return forms.base;
  }

  private getArticle(gender: Nullable<Gender>): string {
    if (!gender) {
      return 'die'; // plural
    }

    switch (gender) {
      case 'masculine':
        return 'der';
      case 'feminine':
        return 'die';
      case 'neuter':
        return 'das';
    }
  }
}
