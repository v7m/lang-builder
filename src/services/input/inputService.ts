import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT_DIR = path.join(__dirname, '../../../input');
const WORDS_LIST_FILE = 'words_list.txt';

async function getInputWords(): Promise<string[]> {
  const filePath = path.join(INPUT_DIR, WORDS_LIST_FILE);
  const content = await fs.readFile(filePath, 'utf8');

  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

export const inputService = {
  getInputWords,
};
