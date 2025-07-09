import wav from 'wav';

const DEFAULT_WAV_CONFIG = {
  channels: 1,
  sampleRate: 24000,
  bitDepth: 16,
};

export class AudioSaver {
  async save(filePath: string, buffers: Buffer[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filePath, DEFAULT_WAV_CONFIG);
  
      writer.on('finish', resolve);
      writer.on('error', reject);
  
      for (const buffer of buffers) {
        writer.write(buffer);
      }
  
      writer.end();
    });
  }
}
