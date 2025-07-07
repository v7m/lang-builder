import { DialogData } from '../types';

// Convert dialog data object into plain text chunks (~maxLength chars),
// each chunk ends with Speaker 2 if possible
export function convertDialogDataToChunks(dialogData: DialogData, maxLength: number = 2000): string[] {
  const chunks: string[] = [];
  let currentPart = '';
  let lastSpeaker = '';
  let buffer: string[] = [];

  for (let i = 0; i < dialogData.dialog.length; i++) {
    const lineObj = dialogData.dialog[i];
    const line = `${lineObj.speaker}: ${lineObj.text}`;
    buffer.push(line);

    const tentativePart = currentPart + (currentPart ? '\n' : '') + line;

    if (tentativePart.length > maxLength) {
      const splitIndex = buffer.map(l => l.startsWith('Speaker 2:')).lastIndexOf(true);

      if (splitIndex === -1 || lastSpeaker === 'Speaker 2') {
        chunks.push(currentPart.trim());
        currentPart = line;
        buffer = [line];
      } else {
        const partLines = buffer.slice(0, splitIndex + 1);
        const leftoverLines = buffer.slice(splitIndex + 1);
        chunks.push(partLines.join('\n').trim());
        currentPart = leftoverLines.join('\n');
        buffer = [...leftoverLines];
      }
    } else {
      currentPart = tentativePart;
    }

    lastSpeaker = lineObj.speaker;
  }

  if (currentPart.trim()) {
    chunks.push(currentPart.trim());
  }

  return chunks;
}
