import fs from 'fs/promises';
import { WordInfo } from '@/types/wordInfo';
import { WordFormsPresenter } from '@/utils/WordFormsPresenter';

const CSV_HEADER = [
  'ID',
  'Word',
  'Part of Speech',
  'Regular',
  'Forms',
  'Translation',
  'Examples'
].join(',') + '\n';

export class CsvSaver {
  async save(filePath: string, wordsData: WordInfo[]): Promise<void> {
    const csvRows = wordsData.map((entry, index) => {
      const { word, grammar, translations, examples } = entry;

      const partOfSpeech = grammar?.partOfSpeech;
      const regularString = grammar?.regular ? 'regular' : 'irregular';
      const formattedFormsString = this.getFormattedFormsString(entry);
      const formattedExamplesString = examples?.join('; ');
      
      return [
        `"${index + 1}"`,
        `"${word}"`,
        `"${partOfSpeech}"`,
        `"${regularString}"`,
        `"${formattedFormsString}"`,
        `"${translations?.ru}"`,
        `"${formattedExamplesString}"`,
      ].join(',');
    }).join('\n');

    await fs.writeFile(filePath, CSV_HEADER + csvRows);
  }

  private getFormattedFormsString(wordInfo: WordInfo): string {
    const { forms, grammar } = wordInfo;
    const partOfSpeech = grammar?.partOfSpeech;
    return forms && partOfSpeech
      ? new WordFormsPresenter(wordInfo).toString()
      : '';
  }
} 
