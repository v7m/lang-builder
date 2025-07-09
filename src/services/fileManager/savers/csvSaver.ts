import fs from 'fs/promises';
import { WordInfo } from '../../../types/wordInfo';
import { WordFormsFormatter } from '../../../utils/wordFormsFormatter';

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
      const { word, grammar, forms, translations, examples } = entry;

      const partOfSpeech = grammar?.partOfSpeech;
      const regularString = grammar?.regular ? 'regular' : 'irregular';
      const formattedFormsString = forms && partOfSpeech 
        ? WordFormsFormatter.toString(forms, partOfSpeech)
        : '';
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
} 
