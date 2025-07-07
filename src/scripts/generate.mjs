import process from 'process';

import { contentGenerator } from '../contentGenerator.mjs';

const args = process.argv.slice(2);

if (args.includes('--all')) {
  contentGenerator.generateLearningContent();
} else {
  console.error('Error: Missing required argument\n');
  console.error('Usage:');
  console.error('  npm run generate -- --all        Generate all content\n');
  process.exit(1);
}
