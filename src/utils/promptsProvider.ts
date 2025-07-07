import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { generationMeta } from './generationMeta';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPTS_DIR = path.join(__dirname, '../../prompts');
const INPUT_DIR = path.join(__dirname, '../../input');

async function getSpeechInstructions(): Promise<string> {
  const filePath = path.join(PROMPTS_DIR, 'speech_instruction.txt');
  return await fs.readFile(filePath, 'utf8');
}

async function getDialogPrompt(numberOfLines: number): Promise<string> {
  const templatePath = path.join(PROMPTS_DIR, 'dialog_prompt_template.ejs');
  const template = await fs.readFile(templatePath, 'utf8');

  return ejs.render(template, {
    number_of_lines: numberOfLines,
    speech_number: generationMeta.getCurrentGenerationNumber()
  });
}

async function getMonologuePrompt(numberOfLines: number): Promise<string> {
  const templatePath = path.join(PROMPTS_DIR, 'monolog_prompt_template.ejs');
  const template = await fs.readFile(templatePath, 'utf8');

  return ejs.render(template, {
    number_of_lines: numberOfLines,
    speech_number: generationMeta.getCurrentGenerationNumber()
  });
}

async function getInputWords(): Promise<string[]> {
  const filePath = path.join(INPUT_DIR, 'words_list.txt');
  const content = await fs.readFile(filePath, 'utf8');

  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

async function getWordsDataPrompt(words: string[]): Promise<string> {
  const templatePath = path.join(PROMPTS_DIR, 'words_data_prompt_template.ejs');
  const template = await fs.readFile(templatePath, 'utf8');

  return ejs.render(template, { words });
}

export {
  getSpeechInstructions,
  getDialogPrompt,
  getMonologuePrompt,
  getInputWords,
  getWordsDataPrompt
};
