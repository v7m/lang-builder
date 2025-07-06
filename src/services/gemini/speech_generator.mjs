import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent';

const GEMINI_MODEL = "gemini-2.5-flash-preview-tts";
const GEMINI_FEMALE_VOICE = "Kore";
const GEMINI_MALE_VOICE = "Puck";

export async function generateSpeech(text, speechInstructions) {
  const textWithInstruction = `${speechInstructions.trim()}\n${text}`;
  
  const requestConfig = {
    model: GEMINI_MODEL,
    contents: [{
      parts: [{
        text: textWithInstruction
      }]
    }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: "Female",
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: GEMINI_FEMALE_VOICE
                }
              }
            },
            {
              speaker: "Male",
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: GEMINI_MALE_VOICE
                }
              }
            }
          ]
        }
      }
    },
  };

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestConfig),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Google API error: ${JSON.stringify(data)}`);
  }

  const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const audioBuffer = Buffer.from(base64Audio, 'base64');

  return audioBuffer;
}
