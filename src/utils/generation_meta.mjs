import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const GENERATION_META_PATH = path.join(DATA_DIR, 'generation_meta.json');

function loadMeta() {
  if (!fs.existsSync(GENERATION_META_PATH)) {
    return { counter: 0, lastGenerated: null };
  }

  return JSON.parse(fs.readFileSync(GENERATION_META_PATH, 'utf-8'));
}

function saveMeta(meta) {
  fs.writeFileSync(GENERATION_META_PATH, JSON.stringify(meta, null, 2));
}

export function getNextCounter() {
  const meta = loadMeta();
  return (meta.counter ?? 0) + 1;
}

export function updateGenerationMeta() {
  const meta = loadMeta();
  const next = (meta.counter ?? 0) + 1;

  meta.counter = next;
  meta.lastGenerated = new Date().toISOString();

  saveMeta(meta);

  return next;
}

export function resetGenerationMeta() {
  saveMeta({ counter: 0, lastGenerated: null });
}
