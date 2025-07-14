import dotenv from 'dotenv';
import { Buffer } from 'buffer';
import process from 'process';
import type { GenerateSpeechRequest } from './types';
import { logger } from '@/services/logger';
import { httpClient } from '@/services/httpClients';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent';
const GEMINI_MODEL = "gemini-2.5-flash-preview-tts";
const client = httpClient.createGeminiClient();

async function perform({
  model = GEMINI_MODEL,
  prompt,
  generationConfig = undefined
}: GenerateSpeechRequest): Promise<Buffer> {
  const requestConfig = {
    model: model,
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: generationConfig
  };

  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  const { data } = await client.post(url, requestConfig);

  if (!data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
    logger.error(`Google API error: ${JSON.stringify(data)}`);
    throw new Error(`Google API error: ${JSON.stringify(data)}`);
  }

  const base64Audio = data.candidates[0].content.parts[0].inlineData.data;
  const audioBuffer = Buffer.from(base64Audio, 'base64');

  return audioBuffer;
}

export const generateSpeechService = {
  perform
};
