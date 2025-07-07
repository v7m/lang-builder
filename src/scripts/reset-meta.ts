import { generationMeta } from '../utils/generationMeta';

async function main() {
  await generationMeta.resetGenerationMeta();
}

main().catch(console.error);
