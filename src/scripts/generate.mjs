import process from 'process';

import { generateDialogTextAndSpeech, generateMonologueTextAndSpeech, generateWordDefinitions } from '../content_generator.mjs';

const args = process.argv.slice(2);

if (args.includes('--dialog')) {
  generateDialogTextAndSpeech();
} else if (args.includes('--monologue')) {
  generateMonologueTextAndSpeech();
} else if (args.includes('--words')) {
  generateWordDefinitions();
} else {
  console.error('Error: Missing required argument\n');
  console.error('Usage:');
  console.error('  npm run generate -- --dialog     Generate dialog');
  console.error('  npm run generate -- --monologue  Generate monologue');
  console.error('  npm run generate -- --words      Generate word definitions\n');
  process.exit(1);
}
