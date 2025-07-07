import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { getNextCounter } from './generation_meta.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPTS_DIR = path.join(__dirname, '../../prompts');
const INPUT_DIR = path.join(__dirname, '../../input');

function getSpeechInstructions() {
  const filePath = path.join(PROMPTS_DIR, 'speech_instruction.txt');

  return fs.readFileSync(filePath, 'utf8');
}

function getDialogPrompt(numberOfLines = 100) {
  const speechNumber = getNextCounter();
  const promptTemplatePath = path.join(PROMPTS_DIR, 'dialog_prompt_template.ejs');
  const promptTemplateContent = fs.readFileSync(promptTemplatePath, 'utf8');

  return ejs.render(promptTemplateContent, {
    speech_number: speechNumber,
    number_of_lines: numberOfLines
  });
}

function getMonologuePrompt() {
  const speechNumber = getNextCounter();
  const promptTemplatePath = path.join(PROMPTS_DIR, 'monologue_prompt_template.ejs');
  const promptTemplateContent = fs.readFileSync(promptTemplatePath, 'utf8');

  return ejs.render(promptTemplateContent, {
    speech_number: speechNumber,
  });
}

function getInputWords() {
  const filePath = path.join(INPUT_DIR, 'words_list.txt');
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n')
    .map(word => word.trim())
    .filter(word => word.length > 0);
}

function getWordsDataPrompt() {
  const promptTemplatePath = path.join(PROMPTS_DIR, 'words_data_prompt_template.ejs');
  const promptTemplateContent = fs.readFileSync(promptTemplatePath, 'utf8');

  return ejs.render(promptTemplateContent);
}

export {
  getSpeechInstructions,
  getDialogPrompt,
  getMonologuePrompt,
  getInputWords,
  getWordsDataPrompt
};
