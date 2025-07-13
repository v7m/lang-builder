import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = path.join(__dirname, '../../../prompts');

async function getSpeechInstructions(): Promise<string> {
  const filePath = path.join(PROMPTS_DIR, 'speech_instruction.txt');
  return await fs.readFile(filePath, 'utf8');
}

async function getDialogPrompt(numberOfLines: number, speechNumber: number): Promise<string> {
  const templatePath = path.join(PROMPTS_DIR, 'dialog_prompt_template.ejs');
  const template = await fs.readFile(templatePath, 'utf8');

  return ejs.render(template, {
    number_of_lines: numberOfLines,
    speech_number: speechNumber
  });
}

async function getWordInfosPrompt(words: string[]): Promise<string> {
  const templatePath = path.join(PROMPTS_DIR, 'word_infos_prompt_template.ejs');
  const template = await fs.readFile(templatePath, 'utf8');

  return ejs.render(template, { words });
}

export const promptsProvider = {
  getSpeechInstructions,
  getDialogPrompt,
  getWordInfosPrompt
};
