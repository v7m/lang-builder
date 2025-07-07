import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { getNextCounter } from './generation_meta.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPTS_DIR = path.join(__dirname, '../../prompts');
const INPUT_DIR = path.join(__dirname, '../../input');

export function getSpeechInstructions() {
  const filePath = path.join(PROMPTS_DIR, 'speech_instruction.txt');
  return fs.readFileSync(filePath, 'utf8');
}

export function getDialogPrompt(numberOfLines = 100) {
  const speechNumber = getNextCounter();
  const templatePath = path.join(PROMPTS_DIR, 'dialog_prompt_template.ejs');
  const templateContent = fs.readFileSync(templatePath, 'utf8');

  return ejs.render(templateContent, {
    speech_number: speechNumber,
    number_of_lines: numberOfLines
  });
}

export function getMonologuePrompt() {
  const speechNumber = getNextCounter();
  const templatePath = path.join(PROMPTS_DIR, 'monologue_prompt_template.ejs');
  const templateContent = fs.readFileSync(templatePath, 'utf8');

  return ejs.render(templateContent, {
    speech_number: speechNumber,
  });
}

export function getWordsList() {
  const filePath = path.join(INPUT_DIR, 'words_list.txt');
  return fs.readFileSync(filePath, 'utf8');
}
