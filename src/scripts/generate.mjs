import { generateDialogTextAndSpeech, generateMonologueTextAndSpeech } from '../content_generator.mjs';

const args = process.argv.slice(2);

if (args.includes('--dialog')) {
  generateDialogTextAndSpeech();
} else if (args.includes('--monologue')) {
  generateMonologueTextAndSpeech();
} else {
  console.error('Error: Missing required argument\n');
  console.error('Usage:');
  console.error('  npm run generate -- --dialog     Generate dialog');
  console.error('  npm run generate -- --monologue  Generate monologue\n');
  process.exit(1);
}
