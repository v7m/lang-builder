import wav from 'wav';

interface WavConfig {
  channels?: number;
  sampleRate?: number;
  bitDepth?: number;
}

export async function saveCombinedWaveFile(
  outputPath: string,
  buffers: Buffer[],
  {
    channels = 1,
    sampleRate = 24000,
    bitDepth = 16,
  }: WavConfig = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const writer = new wav.FileWriter(outputPath, {
      channels,
      sampleRate,
      bitDepth,
    });

    writer.on('finish', resolve);
    writer.on('error', reject);

    for (const buffer of buffers) {
      writer.write(buffer);
    }

    writer.end();
  });
}
