import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = path.join(__dirname, '../../../prompts');

async function getSpeechInstructions(): Promise<string> {
  const filePath = path.join(PROMPTS_DIR, 'de/speech_instruction.txt');
  return await fs.readFile(filePath, 'utf8');
}

async function getDialogPrompt(minNumberOfLines: number, speechNumber: number): Promise<string> {
  const templatePath = path.join(PROMPTS_DIR, 'de/dialog_prompt_template.ejs');
  const template = await fs.readFile(templatePath, 'utf8');

  return ejs.render(template, {
    minNumberOfLines: minNumberOfLines,
    speechNumber: speechNumber
  });
}

async function getWordEntriesPrompt(words: string[]): Promise<string> {
  const templatePath = path.join(PROMPTS_DIR, 'de/word_entries_prompt_template.ejs');
  const template = await fs.readFile(templatePath, 'utf8');

  return ejs.render(template, { words });
}

export const promptsProvider = {
  getSpeechInstructions,
  getDialogPrompt,
  getWordEntriesPrompt
};
