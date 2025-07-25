import { JSDOM } from 'jsdom';
import type {
  WordEntry,
  Grammar,
  PartOfSpeech,
  Translations,
  Gender,
  WordForms,
  NounForms,
  VerbForms,
  AdjectiveForms,
  AdverbForms,
  BaseForms,
} from "@/types/wordEntry";
import { logger } from '@/services/logger';
import { buildCssSelector } from '@/utils/buildCssSelector';
import { Nullable } from '@/types';

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

export class WorterParser {
  private static readonly PARTS_OF_SPEECH: PartOfSpeech[] = [
    'noun',
    'verb',
    'adjective',
    'adverb',
    'pronoun',
    'preposition',
    'particle',
    'conjunction',
    'interjection',
    'numeral',
    'article',
    'unknown',
  ];

  private static readonly GENDER: Gender[] = [
    'masculine',
    'feminine',
    'neuter',
  ];

  private static readonly PARENT_SELECTOR = 'body > article > div:nth-child(1)';
  private static readonly EXAMPLES_SELECTOR = buildCssSelector(
    WorterParser.PARENT_SELECTOR,
    'div.rAbschnitt',
    'div',
    'section:last-child',
    'div.rAufZu',
    'ul.rLst',
    'li',
  );

  private static readonly TRANSLATION_SELECTOR = buildCssSelector(
    WorterParser.PARENT_SELECTOR,
    'div.rInfo',
    'section:first-child',
    'div.rAufZu',
    'dl:nth-of-type(2)',
  );

  private static readonly FORMS_SELECTOR = buildCssSelector(
    WorterParser.PARENT_SELECTOR,
    'div.rInfo',
    'section:nth-child(2)',
    'div.rAufZu'
  );

  private static readonly DEFINITION_SELECTOR = buildCssSelector(
    WorterParser.PARENT_SELECTOR,
    'div.rAbschnitt',
    'div',
    'section:first-child',
    'div.rAufZu',
  );

  private static readonly GENDER_SELECTOR = buildCssSelector(
    WorterParser.DEFINITION_SELECTOR,
    'div#wStckInf',
    'div#wStckKrz',
    'div.rCntr.rClear span[title^="gender"]',
  );

  private static readonly WORD_SELECTOR = buildCssSelector(
    WorterParser.DEFINITION_SELECTOR,
    'div#wStckInf',
    'div#wStckKrz',
    'div.rCntr.rClear q',
  );

  // private static readonly FORMS_SELECTOR = buildCssSelector(
  //   WorterParser.DEFINITION_SELECTOR,
  //   'div#wStckInf',
  //   'div#wStckKrz',
  //   'p:nth-child(2)',
  // );

  private document: Document;
  private word: string;
  private grammar: Grammar;
  private forms: Nullable<WordForms> = null;
  private examples: string[] = [];
  private translations: Translations;

  private constructor(html: string) {
    const dom = new JSDOM(html);
    this.document = dom.window.document;

    this.grammar = this.parseGrammar();
    this.word = this.parseWord();
    this.forms = this.parseForms();
    this.examples = this.parseExamples();
    this.translations = this.parseTranslations();
  }

  static parseHtml(html: string): WordEntry {
    const parser = new WorterParser(html);

    return {
      word: parser.word,
      grammar: parser.grammar,
      forms: parser.forms,
      translations: parser.translations,
      examples: parser.examples,
    };
  }

  // ======= PARSE WORD =======

  private parseWord(): string {
    const container = this.document.querySelector(WorterParser.WORD_SELECTOR);

    if (!container) return '';

    return this.extractDeepText(container as HTMLElement).replace(/\s+/g, ' ');
  }

  // ======= PARSE GRAMMAR =======

  private parseGrammar(): Grammar {
    const grammarSpans = Array.from(
      this.document.querySelectorAll(`${WorterParser.DEFINITION_SELECTOR} span.rInf > span[title]`)
    );

    const tokens = grammarSpans
      .map(span => span.textContent?.trim().toLowerCase())
      .filter(Boolean);

    let partOfSpeech: PartOfSpeech = 'unknown';
    let regular = false;
    let gender = null;

    // Parse part of speech
    const foundPart = tokens.find(token => {
      return WorterParser.PARTS_OF_SPEECH.includes(token as PartOfSpeech);
    });

    if (foundPart) {
      partOfSpeech = foundPart as PartOfSpeech;
    }

    // Parse regular
    regular = tokens.includes('regular');

    // Parse gender from token
    const genderToken = tokens.find(t => WorterParser.GENDER.includes(t as Gender));
    if (genderToken) {
      gender = genderToken as Gender;
    }

    // Fallback gender parsing from DOM (if not determined yet)
    if (partOfSpeech === 'noun' && !gender) {
      const genderContainer = this.document.querySelector(WorterParser.GENDER_SELECTOR);
      const genderRaw = genderContainer?.textContent?.trim().toLowerCase() || '';

      const articleToGenderMap: Record<string, Gender> = {
        der: 'masculine',
        die: 'feminine',
        das: 'neuter',
      };

      if (articleToGenderMap[genderRaw]) {
        gender = articleToGenderMap[genderRaw];
      }
    }

    const grammar: Grammar = {
      partOfSpeech,
      regular,
      gender,
    };

    return grammar;
  }

  // ======= PARSE TRANSLATIONS =======

  private parseTranslations(): Translations {
    const selector = `${WorterParser.TRANSLATION_SELECTOR} dd[lang="ru"]`;
    const translations: Translations = { ru: '' };

    const ruContainer = this.document.querySelector(selector);
    translations.ru = ruContainer?.textContent?.trim() || '';

    const processedTranslations = Object.fromEntries(
      Object.entries(translations).map(([lang, text]) => [
        lang,
        text
          ?.replace(/[\u2026.]+$/, '')        // remove ellipses and dots
          .replace(/[,;]+$/, '')             // remove extra commas and semicolons at the end
          .trim()
      ])
    );

    return processedTranslations as Translations;
  }

  // ======= PARSE EXAMPLES =======

  private parseExamples(): string[] {
    const containers = Array.from(this.document.querySelectorAll(WorterParser.EXAMPLES_SELECTOR)).slice(0, 3);
    const examples: string[] = [];

    containers.forEach((li) => {
      let text = '';

      for (const node of li.childNodes) {
        if (node.nodeType === 3) {
          text += node.textContent;
        } else if ((node as HTMLElement).tagName?.toLowerCase() === 'span') {
          text += (node as HTMLElement).textContent;
        } else if ((node as HTMLElement).tagName?.toLowerCase() === 'a') {
          break;
        }
      }

      text = text.trim().replace(/\s+/g, ' ');
      if (text) examples.push(text);
    });
  
    return examples;
  }

  // ======= PARSE FORMS =======

  private parseForms(): Nullable<WordForms> {
    const container = this.document.querySelector(WorterParser.FORMS_SELECTOR) as HTMLElement;
    const baseForms = { base: this.word } as BaseForms;

    if (!container) return baseForms;

    switch (this.grammar.partOfSpeech) {
      case "verb":
        return this.parseVerbForms(container);
      case "noun":
        return this.parseNounForms(container);
      case "adjective":
        return this.parseAdjectiveForms(container);
      case "adverb":
        return this.parseAdverbForms(container);
      default:
        return baseForms;
    }
  }

  private parseVerbForms(container: HTMLElement): Nullable<VerbForms> {
    if (!container) return null;

    let rawText = '';

    for (const node of container.childNodes) {
      if (
        node.nodeType === ELEMENT_NODE &&
        (node as HTMLElement).classList.contains('wFlxs')
      ) {
        break;
      }

      if (node.nodeType === TEXT_NODE) {
        rawText += node.textContent ?? '';
      } else if (node.nodeType === ELEMENT_NODE) {
        rawText += this.extractDeepText(node as HTMLElement);
      }
    }

    const parts = rawText
      .split('·')
      .map(this.normalizeText);

    if (parts.length !== 3) {
      logger.warn(`❌ Expected 3 verb parts, got ${parts.length}`);
      return null;
    }

    return {
      infinitive: this.word,
      present3: parts[0],
      preterite: parts[1],
      perfect: parts[2],
    };
  }

  private parseNounForms(container: HTMLElement): Nullable<NounForms> {
    let rawText = '';

    for (const node of container.childNodes) {
      if (
        node.nodeType === ELEMENT_NODE &&
        (node as HTMLElement).classList.contains('wFlxs')
      ) break;

      if (node.nodeType === TEXT_NODE) {
        rawText += node.textContent ?? '';
      } else if (node.nodeType === ELEMENT_NODE) {
        rawText += this.extractDeepText(node as HTMLElement);
      }
    }

    const parts = rawText
      .split('·')
      .map(s => this.normalizeText(s))
      .filter(Boolean);

    if (parts.length < 2) {
      logger.warn(`❌ Not enough noun forms found: ${parts}`);
      return null;
    }

    const nominativeSingular = this.grammar.gender ? this.word : null;

    const genitiveSingular = parts[0] === '-' ? null : parts[0];
    const nominativePlural = parts[1];

    return {
      nominativeSingular,
      genitiveSingular,
      nominativePlural
    };
  }

  private parseAdjectiveForms(container: HTMLElement): Nullable<AdjectiveForms> {
    const qElements = Array.from(container.querySelectorAll('q'));
    if (qElements.length === 0) return null;

    const positive = this.extractDeepText(qElements[0] as HTMLElement)
      .replace(/\s+/g, ' ');

    const comparative = qElements[1]
      ? this.extractDeepText(qElements[1] as HTMLElement).replace(/\s+/g, ' ')
      : '';

    const superlative = qElements[2]
      ? this.extractDeepText(qElements[2] as HTMLElement).replace(/\s+/g, ' ')
      : '';

    const forms: AdjectiveForms = {
      positive,
      comparative,
      superlative,
    };

    return forms;
  }

  private parseAdverbForms(container: HTMLElement): Nullable<AdverbForms> {
    if (!container) return { base: this.word } as BaseForms;

    const forms = this.parseAdjectiveForms(container) as AdverbForms;

    if (Object.keys(forms).length === 0) {
      return { base: this.word } as BaseForms;
    }

    return forms;
  }

  // ======= UTILS =======

  private extractDeepText(el: HTMLElement): string {
    let text = '';
    el.childNodes.forEach(node => {
      if (node.nodeType === TEXT_NODE) {
        text += node.textContent;
      } else if (node.nodeType === ELEMENT_NODE) {
        text += this.extractDeepText(node as HTMLElement);
      }
    });
    return text.trim();
  }

  private normalizeText(text: string): string {
    return text
      .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, '')   // remove superscript digits
      .replace(/\s+/g, ' ')            // normalize spaces
      .replace(/\s*\(\s*/g, ' (')      // normalize parentheses
      .replace(/\s*\)\s*/g, ')')       // normalize parentheses
      .trim();
  }
}
