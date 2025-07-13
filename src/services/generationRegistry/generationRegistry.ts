import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { GenerationRegistry } from '@/types';
import { logger } from '@/services/logger';

export type CounterType = 'test' | 'main';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../../data');
const GENERATION_REGISTRY_PATH = path.join(DATA_DIR, 'generation_registry.json');

const DEFAULT_REGISTRY: GenerationRegistry = {
  counter: {
    test: 0,
    main: 0
  },
  lastGenerated: {
    test: null,
    main: null
  }
};

async function getRegistry(): Promise<GenerationRegistry> {
  try {
    const data = await fs.readFile(GENERATION_REGISTRY_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return DEFAULT_REGISTRY;
    }
    throw error;
  }
}

async function updateRegistry(counterType: CounterType, counter: number): Promise<void> {
  const registry = await getRegistry();
  registry.counter[counterType] = counter;
  registry.lastGenerated[counterType] = new Date().toISOString();
  await fs.writeFile(GENERATION_REGISTRY_PATH, JSON.stringify(registry, null, 2));

  logger.success(`Generation registry for ${counterType} has been updated with counter ${counter}`);
}

async function resetRegistry(counterType: CounterType): Promise<void> {
  const registry = await getRegistry();
  registry.counter[counterType] = 0;
  registry.lastGenerated[counterType] = null;
  await fs.writeFile(GENERATION_REGISTRY_PATH, JSON.stringify(registry, null, 2));

  logger.success(`Generation registry for ${counterType} has been reset`, { indent: 1 });
}

async function incrementCounter(counterType: CounterType): Promise<number> {
  const registry = await getRegistry();
  const newCounter = registry.counter[counterType] + 1;
  await updateRegistry(counterType, newCounter);

  return newCounter;
}

async function getCounter(counterType: CounterType): Promise<number> {
  const registry = await getRegistry();
  return registry.counter[counterType];
}

export const generationRegistry = {
  getRegistry,
  updateRegistry,
  resetRegistry,
  incrementCounter,
  getCounter
};
