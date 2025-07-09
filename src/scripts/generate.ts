import process from 'process';
import { contentGenerator } from '../contentGenerator';

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--all')) {
    await contentGenerator.runGeneration();
  } else if (args.includes('--test')) {
    await contentGenerator.test();
  } else {
    console.error('Error: Missing required argument\n');
    console.error('Usage:');
    console.error('  npm run generate -- --all        Generate all content\n');
    process.exit(1);
  }
}

main().catch(console.error);
