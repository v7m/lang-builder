import { 
  WordForms,
  PartOfSpeech,
  VerbForms,
  NounForms,
  AdjectiveForms,
  AdverbForms
} from '../types/wordInfo';

export class WordFormsFormatter {
  static toString(forms: WordForms, partOfSpeech: PartOfSpeech): string {
    switch (partOfSpeech) {
      case 'verb':
        return WordFormsFormatter.verbFormsToString(forms as VerbForms);
      case 'noun':
        return WordFormsFormatter.nounFormsToString(forms as NounForms);
      case 'adjective':
        return WordFormsFormatter.adjectiveFormsToString(forms as AdjectiveForms);
      case 'adverb':
        return WordFormsFormatter.adverbFormsToString(forms as AdverbForms);
      default:
        return WordFormsFormatter.defaultFormsToString(forms);
    }
  }

  static verbFormsToString(verbForms: VerbForms): string {
    return `${verbForms.infinitive}; ${verbForms.present3}; ${verbForms.preterite}; ${verbForms.perfect}`;
  }

  static nounFormsToString(nounForms: NounForms): string {
    return `${nounForms.gender} ${nounForms.singular}; ${nounForms.plural}`;
  }

  static adjectiveFormsToString(adjectiveForms: AdjectiveForms): string {
    return `${adjectiveForms.positive}; ${adjectiveForms.comparative || '-'}; ${adjectiveForms.superlative || '-'}`;
  }

  static adverbFormsToString(adverbForms: AdverbForms): string {
    return `${adverbForms.positive}; ${adverbForms.comparative || '-'}; ${adverbForms.superlative || '-'}`;
  }

  private static defaultFormsToString(forms: WordForms): string {
    return Object.entries(forms)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  }
}
