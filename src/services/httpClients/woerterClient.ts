import axios, { AxiosError } from 'axios';

import { logger } from '@/services/logger';

const MIN_DELAY_MS = 1200; // 1.2 seconds
const MAX_DELAY_MS = 2500; // 2.5 seconds
const RETRY_DELAY_MS = 3000; // 3 seconds
const TIMEOUT_MS = 10000; // 10 seconds
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay() {
  const ms = Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
  logger.debug(`[woerterClient] Delaying request for ${ms}ms`, { indent: 1 });
  return delay(ms);
}

export const woerterClient = axios.create({
  timeout: TIMEOUT_MS,
  headers: HEADERS,
});

woerterClient.interceptors.request.use(async config => {
  await randomDelay();
  return config;
});

woerterClient.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;

    logger.error(`[HTTP Error] ${status || 'No status'} for ${url}`, { indent: 1 });
    logger.error(`[Message] ${error.message}`, { indent: 1 });

    if (status === 429 || (status && status >= 500)) {
      logger.warn(`Retrying request to ${url} after ${RETRY_DELAY_MS}ms...`, { indent: 1 });
      await delay(RETRY_DELAY_MS);
      return woerterClient.request(error.config!);
    }

    return Promise.reject(error);
  }
);
