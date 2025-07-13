import process from 'process';
import { contentGenerator } from '../contentGenerator';

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--main')) {
    await contentGenerator.generateTextAndSpeech();
  } else if (args.includes('--test')) {
    await contentGenerator.testGenerate();
  } else {
    console.error('Error: Missing required argument\n');
    console.error('Usage:');
    console.error('  npm run generate -- --main        Generate main content\n');
    console.error('  npm run generate -- --test        Generate test content\n');
    process.exit(1);
  }
}

main().catch(console.error);
