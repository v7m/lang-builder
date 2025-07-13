import { AxiosInstance } from 'axios';
import { clientWithDelay } from '../core/clientWithDelay';

const TIMEOUT_MS = 180000; // 180 seconds

const OPENAI_HEADERS = {
  'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  'Content-Type': 'application/json'
};

function create(): AxiosInstance {
  return clientWithDelay.create(OPENAI_HEADERS, TIMEOUT_MS);
}

export const openaiClient = {
  create
};
