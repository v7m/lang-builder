import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { GenerationMeta } from '../types';
import { logger } from '../services/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const GENERATION_META_PATH = path.join(DATA_DIR, 'generation_meta.json');

let currentGenerationNumber: number | null = null;

async function loadMeta(): Promise<GenerationMeta> {
  try {
    const data = await fs.readFile(GENERATION_META_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { counter: 0, lastGenerated: null };
    }
    throw error;
  }
}

async function saveMeta(meta: GenerationMeta): Promise<void> {
  await fs.writeFile(GENERATION_META_PATH, JSON.stringify(meta, null, 2));
}

async function resetGenerationMeta(): Promise<void> {
  await saveMeta({ counter: 0, lastGenerated: null });
  logger.success('Generation meta has been reset', { indent: 1 });
}

async function incrementGenerationCounter(): Promise<number> {
  const meta = await loadMeta();
  meta.counter += 1;
  meta.lastGenerated = new Date().toISOString();
  await saveMeta(meta);
  currentGenerationNumber = meta.counter;

  return meta.counter;
}

function getCurrentGenerationNumber(): number {
  if (currentGenerationNumber === null) {
    throw new Error('Generation number is not set. Call incrementGenerationCounter first.');
  }
  return currentGenerationNumber;
}

export const generationMeta = {
  loadMeta,
  saveMeta,
  resetGenerationMeta,
  incrementGenerationCounter,
  getCurrentGenerationNumber
};
