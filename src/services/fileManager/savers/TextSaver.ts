import fs from 'fs/promises';

export class TextSaver {
  async save(filePath: string, text: string): Promise<void> {
    await fs.writeFile(filePath, text, 'utf-8');
  }
} 
