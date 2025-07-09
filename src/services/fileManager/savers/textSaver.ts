import fs from 'fs/promises';

export class TextSaver {
  async save(filePath: string, textChunks: string[]): Promise<void> {
    const fullText = textChunks.join('\n\n');
    await fs.writeFile(filePath, fullText, 'utf-8');
  }
} 
