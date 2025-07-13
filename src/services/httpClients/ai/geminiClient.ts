import { AxiosInstance } from 'axios';
import { clientWithDelay } from '../core/clientWithDelay';

const TIMEOUT_MS = 180000; // 180 seconds

const GEMINI_HEADERS = {
  'Content-Type': 'application/json'
};

function create(): AxiosInstance {
  return clientWithDelay.create(GEMINI_HEADERS, TIMEOUT_MS);
}

export const geminiClient = {
  create
};
