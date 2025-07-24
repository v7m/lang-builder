import { generationRegistry } from '../services/generationRegistry';

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--main')) {
    await generationRegistry.resetRegistry('main');
  } else if (args.includes('--test')) {
    await generationRegistry.resetRegistry('test');
  } else {
    console.error('Error: Missing required argument\n');
    console.error('Usage:');
    console.error('  npm run resetGenerationRegistry -- --main        Reset main generation registry\n');
    console.error('  npm run resetGenerationRegistry -- --test        Reset test generation registry\n');
    process.exit(1);
  }
}

main().catch(console.error);
