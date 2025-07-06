import wav from 'wav';

export async function saveCombinedWaveFile(outputPath, buffers, {
  channels = 1,
  sampleRate = 24000,
  bitDepth = 16,
} = {}) {
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
