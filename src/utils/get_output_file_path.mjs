import path from 'path';

export function getOutputFilePath(outputDir, number, date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const dateString = `${day}.${month}.${year}`;
  const fileName = `speech_${number}_${dateString}.wav`;

  return path.join(outputDir, fileName);
}
