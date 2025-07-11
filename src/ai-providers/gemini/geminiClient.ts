import dotenv from 'dotenv';
import { Buffer } from 'buffer';
import process from 'process';

import { MultiSpeakerConfig } from './configs/multiSpeakerConfig';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent';
const GEMINI_MODEL = "gemini-2.5-flash-preview-tts";

interface TextToSpeechRequest {
  model?: string;
  prompt: string;
  generationConfig?: MultiSpeakerConfig;
}

async function textToSpeechRequest({
  model = GEMINI_MODEL,
  prompt,
  generationConfig = undefined
}: TextToSpeechRequest): Promise<Buffer> {
  const requestConfig = {
    model: model,
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: generationConfig
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers,
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

export const geminiClient = {
  textToSpeechRequest
};
