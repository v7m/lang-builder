// Split the dialog into parts of 2000 characters with the last part being a Speaker 2 reply
export function splitDialog(dialog, maxLength = 2000) {
  const lines = dialog.split('\n').filter(Boolean);

  const parts = [];
  let currentPart = '';
  let lastSpeaker = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tentativePart = currentPart + (currentPart ? '\n' : '') + line;

    if (tentativePart.length > maxLength) {
      if (lastSpeaker === 'Speaker 2') {
        parts.push(currentPart.trim());
        currentPart = line;
      } else {
        // Go back to the last Speaker 2
        const splitLines = currentPart.split('\n');
        let splitIndex = splitLines.lastIndexOf(
          l => l.startsWith('Speaker 2:')
        );

        if (splitIndex === -1) {
          // fallback: cut as is
          parts.push(currentPart.trim());
          currentPart = line;
        } else {
          const partLines = splitLines.slice(0, splitIndex + 1);
          const leftoverLines = splitLines.slice(splitIndex + 1);
          parts.push(partLines.join('\n').trim());
          currentPart = [...leftoverLines, line].join('\n');
        }
      }
    } else {
      currentPart = tentativePart;
    }

    if (line.startsWith('Speaker 1:')) lastSpeaker = 'Speaker 1';
    if (line.startsWith('Speaker 2:')) lastSpeaker = 'Speaker 2';
  }

  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }

  return parts;
}
