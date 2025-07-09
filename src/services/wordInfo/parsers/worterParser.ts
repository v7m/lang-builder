import { JSDOM } from 'jsdom';
import type {
  WordInfo,
  Grammar,
  PartOfSpeech,
  WordForms,
  VerbForms,
  Translations,
} from "../../../types/wordInfo";

export class WorterParser {
  private static readonly PARENT_SELECTOR = 'body > article > div:nth-child(1)';
  private static readonly EXAMPLES_SELECTOR = `
    ${WorterParser.PARENT_SELECTOR}
    > div.rAbschnitt
    > div
    > section:last-child
    > div.rAufZu
    > ul.rLst
    > li`;

  private static readonly DEFINITION_SELECTOR = 
    `${WorterParser.PARENT_SELECTOR}
    > div.rAbschnitt
    > div
    > section:first-child
    > div.rAufZu`;

  private static readonly TRANSLATION_SELECTOR = 
    `${WorterParser.PARENT_SELECTOR}
    > div.rInfo
    > section:first-child
    > div.rAufZu
    > dl:nth-of-type(2)`;

  private document: Document;
  private word: string;
  private grammar: Grammar;
  private forms: WordForms | null = null;
  private examples: string[] = [];
  private translations: Translations;

  private constructor(html: string) {
    const dom = new JSDOM(html);
    this.document = dom.window.document;

    this.word = this.parseWord();
    this.grammar = this.parseGrammar();
    this.forms = this.parseForms();
    this.examples = this.parseExamples();
    this.translations = this.parseTranslations();
  }

  static parseHtml(html: string): WordInfo {
    const parser = new WorterParser(html);

    return {
      word: parser.word,
      grammar: parser.grammar,
      forms: parser.forms ?? {},
      translations: parser.translations,
      examples: parser.examples,
    };
  }

  private parseWord(): string {
    const selector = `${WorterParser.DEFINITION_SELECTOR} > div#wStckInf > div#wStckKrz > div`;
    const element = this.document.querySelector(selector);

    const word = element?.querySelector('u')?.textContent?.trim() || '';

    return word;
  }

  private parseGrammar(): Grammar {
    const partSelector = `${WorterParser.DEFINITION_SELECTOR} > span.rInf > span:nth-child(2)`;
    const regSelector = `${WorterParser.DEFINITION_SELECTOR} > span.rInf > span:nth-child(4)`;
    const partElement = this.document.querySelector(partSelector);
    const regElement = this.document.querySelector(regSelector);

    const partOfSpeech = (partElement?.textContent?.trim() || '') as PartOfSpeech;
    const regularText = regElement?.textContent?.trim() || '';
    const regular = regularText === "regular";

    const grammar: Grammar = {
      partOfSpeech,
      regular,
    };

    return grammar;
  }

  private parseTranslations(): Translations {
    const selector = `${WorterParser.TRANSLATION_SELECTOR} dd[lang="ru"]`;
    const ruElement = this.document.querySelector(selector);
  
    const ruTranslation = ruElement?.textContent?.trim() || '';

    const translations: Translations = { ru: ruTranslation };

    return translations;
  }

  private parseExamples(): string[] {
    const elements = Array.from(this.document.querySelectorAll(WorterParser.EXAMPLES_SELECTOR)).slice(0, 3);
    const examples: string[] = [];

    elements.forEach((li) => {
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

  private parseForms(): WordForms | null {
    const selector = `${WorterParser.DEFINITION_SELECTOR} > div#wStckInf > #wStckKrz > p:nth-child(2)`;
    const element = this.document.querySelector(selector) as HTMLElement;
    if (!element) return null;

    switch (this.grammar.partOfSpeech) {
      case "verb":
        return this.parseVerbForms(element);
      // case "noun":
      //   return this.parseNounForms(...);
      // case "adjective":
      //   return this.parseAdjectiveForms(...);
      default:
        return null;
    }
  }

  private parseVerbForms(sector: HTMLElement): VerbForms | null {
    const rawParts: string[] = [];
    const elements = sector.querySelectorAll('q, i');

    elements.forEach(el => {
      if (el.tagName.toLowerCase() === 'i') {
        rawParts.push(el.textContent?.trim() || '');
      }

      if (el.tagName.toLowerCase() === 'q') {
        let text = '';
        el.childNodes.forEach(sub => {
          if (sub.nodeType === 3) {
            text += (sub.textContent || '').replace(/[".]/g, '');
          } else if ((sub as Element).tagName.toLowerCase() === 'u') {
            text += sub.textContent;
          }
        });
        rawParts.push(text.trim());
      }
    });

    if (rawParts.length < 4) return null;

    const present3 = rawParts[0];
    const preterite = rawParts[1];
    const perfect = `${rawParts[2]} ${rawParts[3]}`;

    const forms: VerbForms = {
      infinitive: this.word,
      present3,
      preterite,
      perfect,
    };

    return forms;
  }
}
